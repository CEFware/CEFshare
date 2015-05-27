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
	    while (specificListingByURI(doc.uri).fetch().length>0) {
		doc.uri=convertToSlug(doc.title)+c;
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
            Listings.remove({_id:id});
            Images.remove({_id:{$in:imgs}},{multi:true});
	} else {
	    throw new Meteor.Error("security-check-fail","Only listing author or admin may delete the listing");
	};
    },

    clientFields: function (doc) {
	//generate schema to check the doc

	//return true if doc checked but empty
	//return false if doc don't pass the check

        return doc;
    }

});
