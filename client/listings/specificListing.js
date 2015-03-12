Template.specificListing.helpers({
    listingImg: function (){
	var listing = specificListingByURI(Router.current().params.uri).fetch().first();
	if (listing) {
	    var imgs=Images.findOne({_id:listing.image});
	    if (imgs)
		return imgs.url();
	};
    },
    listingImgById: function (image){
	if (image) {
	    var imgs=Images.findOne({_id:image});
	    if (imgs)
		return imgs.url();
	};
    },

    listingsByAuthor: function (author){
	return publicListingsByAuthor(author);
    },

    listingsByTags: function (tags){
	return allListingsByTags(tags);
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
    }
});

Template.specificListing.events({
  'click .switchFavorite': function (e,t) {
      e.preventDefault();
      var listing = specificListingByURI(Router.current().params.uri).fetch().first();
      return switchFavoriteListingState(listing._id);
  }
});

Template.specificListing.rendered = function () {
    Tracker.autorun (function (){
	Meteor.subscribe('wishlist');
	var listing = specificListingByURI(Router.current().params.uri).fetch().first();
	if (listing) {
	    Meteor.subscribe('userById',listing.author);
	    Meteor.subscribe('getPublicListingsByAuthor',listing.author);
	    Meteor.subscribe('getListingsByTags',listing.tags);
	    var imgA=[];
	    allListings().forEach(function(el){
		imgA.push(el.image);
	    });
	    Meteor.subscribe('images',imgA);
	};
    });
};
