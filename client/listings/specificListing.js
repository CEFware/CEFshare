getCustomFields = function (listing) {
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

Template.specificListing.helpers({
    listingImg: function (){
	var listing = specificListingByURI(Router.current().params.uri).fetch().first();
	if (listing) {
	    var imgs=Images.findOne({_id:listing.image[0]});
	    if (imgs)
		return imgs.url({store:'images'});
	};
    },

    listingImgs: function () {
	var listing = specificListingByURI(Router.current().params.uri).fetch().first();
	if (listing) {
	    var imgs=Images.find({_id:{$in:listing.image}});
	    if (imgs)
		return imgs;
	};
    },
    
    listingImgById: function (image){
	if (image) {
	    var imgs=Images.findOne({_id:image});
	    if (imgs)
		return imgs.url({store:'thumbs'});
	};
    },

    isListingsByAuthor: function (author){
	if ((specificListingByURI(Router.current().params.uri).fetch().first()) && (publicListingsByAuthor(author,specificListingByURI(Router.current().params.uri).fetch().first()._id,3).fetch().length>0))
	    return true;
	return false;
    },

    listingsByAuthor: function (author){
	if (specificListingByURI(Router.current().params.uri).fetch().first())
	    return publicListingsByAuthor(author,specificListingByURI(Router.current().params.uri).fetch().first()._id,3);
    },

    isListingsByTags: function (tags){
	if (tags && (specificListingByURI(Router.current().params.uri).fetch().first()) && (allListingsByTags(tags,specificListingByURI(Router.current().params.uri).fetch().first()._id,3).fetch().length>0))
	    return true;
	return false;
    },

    listingsByTags: function (tags){
	if (tags)
	    return allListingsByTags(tags,specificListingByURI(Router.current().params.uri).fetch().first()._id,3);
    },

    isRecentListings: function () {
	var uriArr=Cookie.get('recentListings');
	if (uriArr)
            uriArr = uriArr.split(",");
	if ((uriArr.length>0) && (specificListingByURI(Router.current().params.uri).fetch().first()) && (allListingsByURI(uriArr,specificListingByURI(Router.current().params.uri).fetch().first()._id,3).fetch().length>0))
	    return true;
	return false;
    },

    recentListings: function () {
	var uriArr=Cookie.get('recentListings');
        uriArr = uriArr.split(",");
	return allListingsByURI(uriArr,specificListingByURI(Router.current().params.uri).fetch().first()._id,3);
    },

    listing: function () {
	return specificListingByURI(Router.current().params.uri).fetch().first();
    },
    isFavorited: function () {
	var listing = specificListingByURI(Router.current().params.uri).fetch().first();
	if (listing)
	    return isListingFavorited(listing._id);
	return false;
    },
    isListingOwner: function () {
	var listing = specificListingByURI(Router.current().params.uri).fetch().first();
	if (listing && (listing.author===Meteor.userId()))
	    return true;
	return false;
    },
    currency: function (amount) {
	return accounting.formatMoney(amount);
    },
    customFields: function (listing) {
        //return only custom fields filable by seller
	return _.filter(getCustomFields(listing), function (el) {return (el.authorFilable && el.active)});
    },
    showClientFields: function (listing) {
	return (_.filter(getCustomFields(listing), function (el) {return !el.authorFilable})).length>0;
    },
    clientFieldsSchemaObj: function () {
	var listing=Listings.findOne({uri:Router.current().params.uri});
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
            obj.push({dateStart:ListingMain._schema.dateStart});
            obj.push({dateEnd:ListingMain._schema.dateEnd});
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
	return finSchema;
    },
    showField: function (name,type) {
        var pre=_.filter(Main.findOne().listingFields,function (el) {return el.listingType===type});
        if (pre.length>0) {
            var res = _.filter(pre[0].listingFields, function (el2) {return el2.name===name});
            if (res.length>0) 
                return res[0].active;
        };
        return false;
    },
    showQtyToBuy: function (itemName) {
	if ((itemName==='item') || (itemName==='hour'))
	    return true;
	return false;
    },
    customField: function () {
	if ((this.name==='qtyToBuy') || (this.name==='dateStart') || (this.name==='dateEnd') || (this.name==='dateTime'))
	    return false;
	return true;
    },
    getDateRange: function (name) {
	if (name==='day')
	    return true;
	return false;
    },
    dateStartOptions: function () {
	return {startDate: new Date(), todayBtn: "linked", autoclose:true, todayHighlight: true}
    },
    dateEndOptions: function () {
	return {startDate: new Date(), todayBtn: "linked", autoclose:true, todayHighlight: true}
    },
    getDays: function () {
	var res = Session.get('daysNum');
	if (res)
	    return res;
	return 1;
    },
    getStartTime: function (name) {
	if (name==='hour')
	    return true;
	return false;
    },
    dateTimeOptions: function () {
	return {minDate: new Date(), useCurrent: true, inline:true, sideBySide:true, todayHighlight: true, showTodayButton:true}
    },
    listingUri: function () {
	return Router.current().params.uri;
    }
    
});

Template.specificListing.events({
    'click .switchFavorite': function (e,t) {
	e.preventDefault();
	if (Meteor.user()) {
	    var listing = specificListingByURI(Router.current().params.uri).fetch().first();
	    return switchFavoriteListingState(listing._id);
	};
    },

    'click #productMain .thumb': function (e,t) {
	e.preventDefault();
        $('#productMain .thumb').removeClass('active');
        var bigUrl = $(e.currentTarget).attr('href');
        $(e.currentTarget).addClass('active');
        $('#productMain #mainImage img').attr('src', bigUrl);
    } ,

    'click .deleteListing': function (e,t){
	e.preventDefault();
	//delete listing & images
	Meteor.call('deleteListing',specificListingByURI(Router.current().params.uri).fetch().first()._id, function (e,r) {
	    if (!e)
		Router.go('home');
	});
    },

    'change [name=dateStart], change [name=dateEnd]': function (e,t) {
	var date1 = new Date($('[name=dateEnd]').val());
	var date2 = new Date($('[name=dateStart]').val());
	var timeDiff = Math.abs(date2.getTime() - date1.getTime());
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
	Session.set('daysNum',diffDays);
    }
});

Template.specificListing.rendered = function () {
   $('#jsToLoad').html('<script type="text/javascript" src="/js/jquery.cookie.js"></script><script type="text/javascript" src="/js/front.js"></script>');
    Tracker.autorun (function (){
	Meteor.subscribe('wishlist');
	var listing = specificListingByURI(Router.current().params.uri).fetch().first();
	if (listing) {
	    Meteor.subscribe('userById',listing.author);
	    Meteor.subscribe('getPublicListingsByAuthor',listing.author);
	    if (listing.tags)
		Meteor.subscribe('getListingsByTags',listing.tags);
	    var uriArr=Cookie.get('recentListings');
	    if (uriArr)
		uriArr = uriArr.split(",");
	    if (uriArr.length>0)
		Meteor.subscribe('getListingsByURI',uriArr);
	    var imgA=[];
	    allListings().forEach(function(el){
		imgA=_.union(imgA, el.image);
 	    });
	    Meteor.subscribe('images',imgA);
	};
    });
};

AutoForm.addHooks(['clientFields'],{
    onSuccess: function (formType,result){
	if (result) {
            var item = {};
            if(!Meteor.userId()){
		item.deviceId = Session.get('Cart-deviceId');
            }else{
		item.userId = Meteor.userId();
            };
            var listing = specificListingByURI(Router.current().params.uri).fetch()[0];
            if (listing) {
		item.qty=result.qtyToBuy;
		item.product=listing;
		item.price=listing.price;
		item.clientData=result;
		Cart.Items.insert(item);
		//in case we do mistake - and do need to delete all the cart items: uncomment the line below & and add anything to the cart, comment this line again
		//              Cart.Items.find().forEach(function (e){Cart.Items.remove({_id:e._id});});
            };
	    
            Flash.success(1,TAPi18n.__("Thank you!"),2000);
	};
    }
});
