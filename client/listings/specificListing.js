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
	if ((specificListingByURI(Router.current().params.uri).fetch().first()) && (allListingsByTags(tags,specificListingByURI(Router.current().params.uri).fetch().first()._id,3).fetch().length>0))
	    return true;
	return false;
    },

    listingsByTags: function (tags){
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
        //return only custom fields
        var curType=listing.listingType
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

