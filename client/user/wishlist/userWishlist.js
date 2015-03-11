Template.userWishlist.helpers({
    isFavorited: function (_id) {
        if (_id)
            return isListingFavorited(_id);
    },
    listings: function () {
	var arr=[];
	Wishlist.find().forEach(function(el){
	    if (_.indexOf(arr,el.id)<0)
		arr.push(el.id);
	});
	return Listings.find({_id:{$in:arr}});
    }
});

Template.userWishlist.events({
    'click .switchFavorite': function () {
        return switchFavoriteListingState(this._id);
    }
});

Template.userWishlist.rendered = function (){
    Tracker.autorun(function () {
	var _idArray=[];
	Meteor.subscribe('wishlist',Router.current().params.username);
	Wishlist.find().forEach(function (el){
	    _idArray.push(el.id);
	});
	Meteor.subscribe('getListingsBy_IdArray',_idArray);
    });
};
 
