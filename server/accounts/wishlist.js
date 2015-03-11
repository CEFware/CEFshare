Meteor.publish('wishlist', function (username) {
    if (username) {
	return Wishlist.find({
	    user_id:Meteor.users.findOne({username:username})._id     
	});
    } else {
	return Wishlist.find({
	    user_id: this.userId
	});
    };
});

