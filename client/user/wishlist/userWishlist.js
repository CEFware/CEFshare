Template.userWishlist.helpers({
    listings: function () {
	var arr=[];
	Wishlist.find().forEach(function(el){
	    if (_.indexOf(arr,el.id)<0)
		arr.push(el.id);
	});
	return Listings.find({_id:{$in:arr}});
    },
    listingImg: function (){
        var listing = this;
        if (listing) {
            var imgs=Images.findOne({_id:listing.image[0]});
            if (imgs)
                return imgs.url({store:'thumbs'});
        };
    },
    listingIsPublic: function () {
        return this.isPublic;
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
        var imgA=[];
        allListings().forEach(function(el){
            imgA=_.union(imgA, el.image);
        });
        Meteor.subscribe('images',imgA);
     });
};
 
