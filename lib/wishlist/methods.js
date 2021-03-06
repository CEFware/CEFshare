isListingFavorited = function (_id) {
    check(_id, String);

    var result = Wishlist.findOne({
	id: _id,
	user_id: Meteor.userId()
    });

    if (!result) {
	return false;
    }
    return true;
};

favoriteListing = function (_id) {
    check(_id, String);

    if (!isListingFavorited(_id)) {

	Wishlist.insert({
	    id: _id,
	    user_id: Meteor.userId()
	});
    }
};

unfavoriteListing = function (_id) {
    check(_id, String);

    var toDelete = Wishlist.findOne({
	id: _id,
	user_id: Meteor.userId()
    });

    Wishlist.remove(toDelete._id);
};

switchFavoriteListingState = function (_id) {
    check(_id, String);

    if (isListingFavorited(_id)) {
	unfavoriteListing(_id);
    }
    else {
	favoriteListing(_id);
    };
};
