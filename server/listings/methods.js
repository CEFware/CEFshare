Meteor.methods({

    createNewListing: function (doc) {
	//security check - must be a user
	if (Meteor.userId()) {
	    var convertToSlug = function(Text) {
		return Text
		    .toLowerCase()
		    .replace(/[^\w ]+/g,'')
		    .replace(/ +/g,'-')
		;
	    };

	    doc.createdAt=new Date;
	    doc.uri=convertToSlug(doc.title);
	    check(doc, Listing);

	    var c=1;
	    var lastUri=doc.uri;
	    while (specificListingByURI(doc.uri).fetch().length>0) {
		doc.uri=lastUri+c;
		c++;
	    };
	    
	    Listings.insert(doc);
	
	    return doc.uri;
	} else {
	    throw new Meteor.Error("security-check-fail","You need to be a user to be able to create new listing");
	};
    },

    deleteListing : function (id) {
	var listing=Listings.findOne({_id:id});
        var imgs=listing.image;
	//security check - admin or author
	if ((Meteor.userId()===listing.author) || (Roles.userIsInRole(Meteor.userId(),'admin'))) {
            Listings.update({_id:id},{$set:{isPublic:false}});
//            Images.remove({_id:{$in:imgs}},{multi:true});
	} else {
	    throw new Meteor.Error("security-check-fail","Only listing author or admin may delete the listing");
	};
    },

    clientFields: function (doc) {
	//generate schema to check the doc

	var getCustomFields = function (listing) {
	    var curType=listing.listingType;
	    var custF=[];
	    var defF=[];
	    if (curType) {
		Main.findOne().listingFields.forEach(function (el) {
		    if (el.listingType===curType)
			custF=el.listingFields;
		});
		if (!Main.findOne({'defaultListingFields.listingType':curType}))
		    curType='DEFAULT';
		Main.findOne().defaultListingFields.forEach(function (el) {
		    if (el.listingType===curType)
			defF=el.listingFields;
		});

		var res=_.filter(custF,function (obj) {return !_.findWhere(defF, obj)});
		for (var i=0;i<res.length;i++) {
		    res[i].value=listing[res[i].name];
		};
		return res;
	    };
	};

        var listing=Listings.findOne({uri:doc.uri});
        var fields=_.filter(getCustomFields(listing), function (el) {return !el.authorFilable});
        var obj=[];
        fields.forEach(function (el){
            if (el.active) {
                var newField=ListingMain._schema[el.type];
                if (newField.type.name==="Array") {
                    var nObj = {};
                    nObj[el.name]=ListingMain._schema[el.type];
                    nObj[el.name].optional=el.optional;
                    nObj[el.name+'.$']=ListingMain._schema[el.type+'.$'];
                    nObj[el.name+'.$'].optional=el.optional;
                    obj.push(nObj);
                } else {
                    var nObj = {};
                    newField.optional=el.optional;
                    nObj[el.name]=newField;
                    obj.push(nObj);
                };
            };
        });

        switch (listing.itemName) {
            case 'item':
            obj.push({qtyToBuy:ListingMain._schema.qtyToBuy});
            obj.push({uri:ListingMain._schema.uri});
            break;
            case 'day':
            obj.push({datePick:ListingMain._schema.datePick});
            obj.push({qtyToBuy:ListingMain._schema.qtyToBuy});
            obj.push({uri:ListingMain._schema.uri});
            break;
            case 'hour':
            obj.push({dateTime:ListingMain._schema.dateTime});
            obj.push({qtyToBuy:ListingMain._schema.qtyToBuy});
            obj.push({uri:ListingMain._schema.uri});
            break;
        };

        var finSchema=new SimpleSchema(obj);
        var objL={};
        fields.forEach(function (el){
            objL[el.name]=eval("tmp=function () {return TAPi18n.__('"+el.title+"')}");
        });
        finSchema.labels(objL);

        var msg=TAPi18n.__("Start date can't be after End date.");
        finSchema.messages({"wrongStartDate":msg});

	check(doc,finSchema);
	
        return doc;
    }
});
