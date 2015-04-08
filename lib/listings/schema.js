Listings = new Mongo.Collection('listings');

Listing = {};

Listing = new SimpleSchema({
    title: {
	type: String,
	label: function () {return TAPi18n.__('Title')}
    },
    description: {
	type: String,
	label: function () {return TAPi18n.__('Description')}
    },
    details: {
	type: String,
	label: function () {return TAPi18n.__('Details')},
	autoform: {
	    afFieldInput: {
		type: 'summernote',
		class: 'editor',
		height:300,
		toolbar: [
		    ['style', ['bold', 'italic', 'underline', 'clear']],
		    ['font', ['strikethrough']],
		    ['para', ['ul', 'ol']],
		    ['insert', ['hr']],
		    ['misc', ['fullscreen', 'codeview','undo','redo']],
		]
	    }
	}
    },
    tags: {
	type: [String],
	label: function () {return TAPi18n.__('Tags')}
    },
    image: {
	type: [String],
	label: function () {return TAPi18n.__('Listing image')}
    },
    "image.$":{
	autoform: {
	    afFieldInput: {
		type:'fileUpload',
		collection: 'Images'
	    }
	}
    },
    price: {
	type: Number,
	decimal: true,
	label: function () {return TAPi18n.__('Price')},
    }, 
    tax: {
	type: Number,
	decimal: true,
	defaultValue: 0,
	label: function () {return TAPi18n.__('Tax in % (0 - no tax)')},
    }, 
    shippingFee: {
	type: Number,
	defaultValue: 0,
	decimal: true,
	label: function () {return TAPi18n.__('Shipping (0 - no shipping)')},
    }, 
    uri: { 
	type: String,
	optional:true
    },
    isRibbonSale: {
	type: Boolean,
	label: function () {return TAPi18n.__('Show ribbon NEW?')}
    },
    isRibbonNew: {
	type: Boolean,
	label: function () {return TAPi18n.__('Show ribbon TRENDY?')}
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
