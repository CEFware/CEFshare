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

var getField	=    function (name,type) {
    var pre=_.filter(Main.findOne().listingFields,function (el) {return el.listingType===type});
    if (pre.length>0) {
	var res = _.filter(pre[0].listingFields, function (el2) {return el2.name===name});
	if (res.length>0)
            return res= res[0];
    };
    return false;
};

var customVal = function (res,data) {
    if (res && res.active && (!res.optional) && (typeof data.value==='undefined'))
	return "required";
}; 

var myDate= new Date();
var tomorrow = new Date(myDate.setDate(myDate.getDate() + 1));

ListingMain = new SimpleSchema({
    title: {
	type: String,
	label: function () {return TAPi18n.__('Title')},
	optional: true,
	custom: function () {
	    var res=getField(this.key,this.field("listingType").value);
	    return customVal (res,this);
	}
    },
    description: {
	type: String,
	label: function () {return TAPi18n.__('Description')},
	optional: true,
	custom: function () {
	    var res=getField(this.key,this.field("listingType").value);
	    return customVal (res,this);
	}
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
	},
	optional: true,
	custom: function () {
	    var res=getField(this.key,this.field("listingType").value);
	    return customVal (res,this);
	}
    },
    tags: {
	type: [String],
	label: function () {return TAPi18n.__('Tags')},
	optional: true,
	custom: function () {
	    var res=getField(this.key,this.field("listingType").value);
	    return customVal (res,this);
	}
    },
    image: {
	type: [String],
	label: function () {return TAPi18n.__('Listing image')},
	optional: true,
	custom: function () {
	    var res=getField(this.key,this.field("listingType").value);
	    return customVal (res,this);
	}
    },
    price: {
	type: Number,
	decimal: true,
	min: 0,
	label: function () {return TAPi18n.__('Price')},
	optional: true,
	custom: function () {
	    var res=getField(this.key,this.field("listingType").value);
	    return customVal (res,this);
	}
    }, 
    itemName: {
	type: String,
	label: function () {return TAPi18n.__('What you sale:')},
	autoform: {
	    options: [
		{label:"item", value:"item"},
		{label:"day", value:"day"},
		{label:"hour", value:"hour"}
	    ]
	},
	optional: true,
	custom: function () {
	    var res=getField(this.key,this.field("listingType").value);
	    return customVal (res,this);
	}
    },
    tax: {
	type: Number,
	decimal: true,
	defaultValue: 0,
	min: 0,
	label: function () {return TAPi18n.__('Tax in % (0 - no tax)')},
	optional: true,
	custom: function () {
	    var res=getField(this.key,this.field("listingType").value);
	    return customVal (res,this);
	}
    }, 
    shippingFee: {
	type: Number,
	defaultValue: 0,
	decimal: true,
	min: 0,
	label: function () {return TAPi18n.__('Shipping (0 - no shipping)')},
	optional: true,
	custom: function () {
	    var res=getField(this.key,this.field("listingType").value);
	    return customVal (res,this);
	}
    }, 
    uri: { 
	type: String,
	optional:true
    },
    isRibbonSale: {
	type: Boolean,
	label: function () {return TAPi18n.__('Show ribbon NEW?')},
	optional: true,
	custom: function () {
	    var res=getField(this.key,this.field("listingType").value);
	    return customVal (res,this);
	}
    },
    isRibbonNew: {
	type: Boolean,
	label: function () {return TAPi18n.__('Show ribbon TRENDY?')},
	optional: true,
	custom: function () {
	    var res=getField(this.key,this.field("listingType").value);
	    return customVal (res,this);
	}
    },
    isPublic: {
	type: Boolean,
	defaultValue: true,
	label: function () {return TAPi18n.__('Is this listing public?')}
    },
    active: {
	type: Boolean,
	label: function () {return TAPi18n.__('Show in slider on homepage?')},
	optional: true,
	custom: function () {
	    var res=getField(this.key,this.field("listingType").value);
	    return customVal (res,this);
	}
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
    },
    qtyToBuy: {
	type: Number,
	defaultValue: 1,
	min: 1
    },
    dateStart: {
	type: Date,
	label: function () {return TAPi18n.__('Start date:')},
	defaultValue: new Date(),
	autoform: {
	    afFieldInput: {
		type: "bootstrap-datepicker"
	    }
	}
    },
    dateEnd: {
	type: Date,
	label: function () {return TAPi18n.__('End date:')},
	defaultValue: tomorrow,
	autoform: {
	    afFieldInput: {
		type: "bootstrap-datepicker"
	    }
	}
    },
    dateTime: {
	type: Date,
	label: function () {return TAPi18n.__('End date:')},
	defaultValue: tomorrow,
	autoform: {
	    afFieldInput: {
		type: "bootstrap-datetimepicker"
	    }
	}
    }
});

var makeSchema=function () {
    var obj = [ListingDefault];
    var fields=Main.findOne();

    if (fields) {
	fields=fields.listingFields;
	var allF=[];
	fields.forEach(function (el){
	    allF=_.union(allF,el.listingFields);
	});
	fields=_.filter(allF,function (o){return o.authorFilable;});
	fields.forEach(function (el){
	    var newField=ListingMain._schema[el.type];
	    if (newField.type.name==="Array") {
		var nObj = {};
                nObj[el.name]=ListingMain._schema[el.type];
//                nObj[el.name].optional=el.optional;
                nObj[el.name+'.$']=ListingMain._schema[el.type+'.$'];
                nObj[el.name+'.$'].optional=el.optional;
		obj.push(nObj);
	    } else {
		var nObj = {};
//		newField.optional=el.optional;
		nObj[el.name]=newField;
		obj.push(nObj);
	    };
	});
	Listing = new SimpleSchema (obj);
	
        var objL={};
        fields.forEach(function (el){
            objL[el.name]=eval("tmp=function () {return TAPi18n.__('"+el.title+"')}");
        });
        Listing.labels(objL);
	
	Listings.attachSchema(Listing);
    };
};

if (Meteor.isClient) {
    Meteor.subscribe('appSettings');
    Tracker.autorun(function () {
	makeSchema();
    });
} else {
    makeSchema();
};
