Wishlist = new Mongo.Collection('wishlist');

var wishlistSchema = new SimpleSchema({
    id: { //_id of the favorited listing
	type: String
    },
    user_id: {
	type: String
    },
    addedOn: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date;
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date};
            } else {
                this.unset();
            }
        }
    }
});

Wishlist.attachSchema(wishlistSchema);

