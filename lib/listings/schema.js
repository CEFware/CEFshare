Listings = new Mongo.Collection('listings');

Listing = {};

Listing = new SimpleSchema({
    title: {
	type: String,
	label: 'Title'
    },
    description: {
	type: String,
	label: 'Description'
    },
    tags: {
	type: [String],
	label: 'Tags'
    },
    image: {
	type: String,
	label: 'Artwork image',
	autoform: {
	    afFieldInput: {
		type:'fileUpload',
		collection: 'Images'
	    }
	}
    },
    uri: { 
	type: String,
	optional:true
    },
    isPublic: {
	type: Boolean,
	label: function () {return TAPi18n.__('Is this listing public ?')}
    },
    active: {
	type: Boolean,
	label: function () {return TAPi18n.__('Available for sale?')}
    }, 
    author: {
	type: String,
        autoValue: function() {
	    return Meteor.userId();
        }
    },
    createdAt: {
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

Listings.attachSchema(Listing);
