Listings = new Mongo.Collection('listings');

Listing = {};

ListingDefault = new SimpleSchema({
    listingType: {
        type: String,
        label: function () {return TAPi18n.__('Listing type')}
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
    uri: { 
	type: String,
	optional:true
    },
    author: {
	type: String,
	optional:true,
        autoValue: function() {
            if (this.isInsert) {
		return Meteor.userId();
            } else {
                this.value;
            };
        }
    },
    authorUsername: {
	type: String,
	optional:true,
        autoValue: function() {
            if (this.isInsert) {
		return Meteor.user().username;
            } else {
                this.value;
            };
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

ListingMain = new SimpleSchema({
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
	defaultValue: true,
	label: function () {return TAPi18n.__('Is this listing public?')}
    },
    active: {
	type: Boolean,
	label: function () {return TAPi18n.__('Show in slider on homepage?')}
    }, 
    author: {
	type: String,
	optional:true,
        autoValue: function() {
            if (this.isInsert) {
		return Meteor.userId();
            } else {
                this.value;
            };
        }
    },
    authorUsername: {
	type: String,
	optional:true,
        autoValue: function() {
            if (this.isInsert) {
		return Meteor.user().username;
            } else {
                this.value;
            };
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

var obj = [ListingDefault];

if (Meteor.isClient) {
    Meteor.subscribe('appSettings');
    Tracker.autorun(function () {
	var fields=Main.findOne();
	if (fields) {
	    fields=fields.listingFields;
	    var allF=[];
	    fields.forEach(function (el){
		allF=_.union(allF,el.listingFields);
	    });
	    fields=allF;
	    fields.forEach(function (el){
		var newField=ListingMain._schema[el.type];
		if (newField.type.name==="Array") {
		    newField=ListingMain.pick(el.type,el.type+'.$');
		    newField._schema[el.type].label=function () {return TAPi18n.__(el.title)};
		    newField._schema[el.type].optional=el.optional;
		    obj.push(newField);
		} else {
		    newField.label=function () {return TAPi18n.__(el.title)};
		    newField.optional=el.optional;
		    var nObj = {};
		    nObj[el.name]=newField;
		    obj.push(nObj);
		};
	    });
	    Listing = new SimpleSchema (obj);
	    Listings.attachSchema(Listing);
	};
    });
} else {

    var fields=Main.findOne();

    if (fields) {
	fields=fields.listingFields;
	var allF=[];
	fields.forEach(function (el){
	    allF=_.union(allF,el.listingFields);
	});
	fields=allF;
	fields.forEach(function (el){
	    var newField=ListingMain._schema[el.type];
	    if (newField.type.name==="Array") {
		newField=ListingMain.pick(el.type,el.type+'.$');
		newField._schema[el.type].label=function () {return TAPi18n.__(el.title)};
		newField._schema[el.type].optional=el.optional;
		obj.push(newField);
	    } else {
		newField.label=function () {return TAPi18n.__(el.title)};
		newField.optional=el.optional;
		var nObj = {};
		nObj[el.name]=newField;
		obj.push(nObj);
	    };
	});
	Listing = new SimpleSchema (obj);
	Listings.attachSchema(Listing);
    };
};
