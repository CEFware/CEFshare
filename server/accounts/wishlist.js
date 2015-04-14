Meteor.publish('wishlist', function (username) {
    if (username) {
	var res=Meteor.users.findOne({username:username});
	if (res) {
	    return Wishlist.find({
		user_id:res._id
	    });
	};
    } else {
	return Wishlist.find({
	    user_id: this.userId
	});
    };
});

