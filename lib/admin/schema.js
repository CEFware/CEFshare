Maillist = new Mongo.Collection('maillist');

Main = new Mongo.Collection('main');

Categories = new Mongo.Collection('categories');

TypesCount = new Mongo.Collection('typesCount');

SimpleSchema.messages({duplicateFound: 'Duplicate found!'});

convertToSlug = function(Text) {
    return Text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')
    ;
};

inviteSchema = new SimpleSchema({
    emails: {
	type: String,
        label: function () {return TAPi18n.__('Emails')}
    },
    subject: {
	type: String,
        label: function () {return TAPi18n.__('Subject')}
    },
    message: {
	type: String,
        label: function () {return TAPi18n.__('Message')},
        autoform: {
            afFieldInput: {
                type: 'summernote',
                class: 'editor',
		settings: {
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
        }
    }
});

oneListingField = new SimpleSchema({
    name: {
	type: String
    },
    title: {
	type: String
    },
    type: {
	type: String,
	autoform: {
	    options: function () {
		var arr=(_.keys(ListingMain._schema)).filter(function (v){
		    return ((v.indexOf("$")<0) && ListingMain._schema[v].label);
		});
		return arr.map(function(v){
			return {label:v,value:v}
		});
	    }
	},
    },
    optional: {
	type: Boolean,
	defaultValue: true,
        label: function () {return TAPi18n.__('Make this field optional')},
    },
    active: {
	type: Boolean
    },
    authorFilable: {
	type: Boolean,
	defaultValue: true,
        label: function () {return TAPi18n.__('If checked - seller fills this field, otherwise - buyer.')},
    },
    letDelete: {
	type: Boolean
    }
});

typeListingField = new SimpleSchema({
    listingType: {
	type: String,	
        label: function () {return TAPi18n.__('Listing type name')},
	custom: function() {
	    if (this.value.length===0) {
		return "required";
 	    } else {
                if (Main.findOne({'listingFields.listingType':this.value}))
		    return "duplicateFound";
	    };
	}
    },
    listingFields: {
	type: [oneListingField],
	optional:true
    }
});

categoriesSchema = new SimpleSchema({
    name: {
	type: String,
	custom: function() {
	    if (this.value.length===0) {
		return "required";
	    } else if (this.field('parent').value) {
                if (Categories.findOne({name:this.value,parent:this.field('parent').value}))
		    return "duplicateFound";
 	    } else {
                if (Categories.findOne({name:this.value, parent: {$exists:false}}))
		    return "duplicateFound";
	    };
	}
    },
    parent: {
	type: String,
	autoform: {
	    options: function () {
		return Categories.find({parent: {$exists:false}}).map(function(v) {
		    return {label:v.name,value:v.name};
		});
	    }
	},
	optional: true
    },
    fields: {
	type: [String],
	optional: true
    },
    listings: {
	type: [String],
	optional: true
    }
});

analyticsSchema = new SimpleSchema({
    analyticsId: {
	type: String,
        label: function () {return TAPi18n.__('Google Analytics tracking ID')},
	optional: true
    }
});

settingsSchema = new SimpleSchema({
    accessInvite: {
	type: Boolean,
	label: function () {return TAPi18n.__('Users can only join this marketplace with an invite from another user')},
	optional: true
    },
    accessUsersMayInvite: {
	type: Boolean,
	label: function () {return TAPi18n.__('All users can invite new users to this marketplace')},
	defaultValue:true,
	optional: true
    },
    accessPrivate: {
	type: Boolean,
	label: function () {return TAPi18n.__('This marketplace is private (only registered users can see the content)')},
	optional: true
    },
    accessVerified: {
	type: Boolean,
	label: function () {return TAPi18n.__('Only users verified by admin can post new listings')},
	optional: true
    },
    listingType: {
	type: Boolean,
	label: function () {return TAPi18n.__('Display listing type in list view')},
	optional: true
    },
    listingDate: {
	type: Boolean,
	label: function () {return TAPi18n.__('Display publishing date of the listing on the listing page')},
	optional: true
    },
    listingExpiration: {
	type: Boolean,
	label: function () {return TAPi18n.__('Do not require listings to have an expiration date')},
	optional: true
    },
    listing: {
	type: Boolean,
	label: function () {return TAPi18n.__('Allow users to post comments to listings (viewable to all other users)')},
	optional: true
    },
    transactionsDays: {
	type: Number,
	defaultValue:14,
	label: function () {return TAPi18n.__('Number of days after which transaction will be automatically marked as completed if the payment has been made')},
	optional: true
    },
    emailFrequency: {
	type: Boolean,
	defaultValue:true,
	label: function () {return TAPi18n.__('Send automatic daily / weekly newsletters to all users (unless they opt out)')},
	optional: true
    },
    emailSelectFrequency: {
	type: String,
	autoform: {
	    options: [{label:"Weekly",value:"weekly"}, {label:"Daily", value:"daily"}]
	},
	label: function () {return TAPi18n.__('Send automatic newsletter:')},
	optional: true
    },
    emailAdminNewUsers: {
	type: Boolean,
	label: function () {return TAPi18n.__('Send admins an email whenever a new user signs up')},
	optional: true
    }

});

emailsSchema = new SimpleSchema({
    welcomeEmail: {
	type: String,
        label: function () {return TAPi18n.__('Welcome email text')},
	optional: true,
        autoform: {
            afFieldInput: {
                type: 'summernote',
                class: 'editor',
		settings: {
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
        }
    }
});

instructionsSchema = new SimpleSchema({
/*    signupInfo: {
	type: String,
        label: function () {return TAPi18n.__('Signup info')},
	optional: true,
        autoform: {
            afFieldInput: {
                type: 'summernote',
                class: 'editor',
		settings: {
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
        }
    },
*/    subscribeInfo: {
	type: String,
        label: function () {return TAPi18n.__('"Get the news" footer text')},
	optional: true,
        autoform: {
            afFieldInput: {
                type: 'summernote',
                class: 'editor',
		settings: {
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
        }
    }
});

socialSchema = new SimpleSchema({
    twitterHandle: {
	type: String,
        label: function () {return TAPi18n.__('Twitter profile link')},
	optional: true
    },
    fbHandle: {
	type: String,
        label: function () {return TAPi18n.__('Facebook profile link')},
	optional: true
    },
    googleHandle: {
	type: String,
        label: function () {return TAPi18n.__('Google+ profile link')},
	optional: true
    },
    fbAppId: {
	type: String,
        label: function () {return TAPi18n.__('Facebook Application Id ')},
	optional: true
    },
    fbSecret: {
	type: String,
        label: function () {return TAPi18n.__('Facebook Application Secret ')},
	optional: true
    },
    twitterConsumerKey: {
	type: String,
        label: function () {return TAPi18n.__('Twitter Consumer Key ')},
	optional: true
    },
    twitterSecret: {
	type: String,
        label: function () {return TAPi18n.__('Twitter Consumer Secret ')},
	optional: true
    },
    googleClientId: {
	type: String,
        label: function () {return TAPi18n.__('Google Client ID ')},
	optional: true
    },
    googleSecret: {
	type: String,
        label: function () {return TAPi18n.__('Google Client Secret ')},
	optional: true
    }
});

var entityAddress = new SimpleSchema({	
    entityName: {
        type: String,
        optional:true
    },
    firstLine: {
        type: String,
        label: function () {return TAPi18n.__("Street - 1st line")},
        optional:true
    },
    secondLine: {
        type: String,
        label: function () {return TAPi18n.__("Street - 2nd line")},
        optional:true
    },
    city: {
        type: String,
        label: function () {return TAPi18n.__("City")},
        optional:true
    },
    zip: {
        type: String,
        label: function () {return TAPi18n.__("ZIP")},
        optional:true
    },
    state: {
        type: String,
        label: function () {return TAPi18n.__("State")},
        optional:true
    },
    country: {
        type: String,
        label: function () {return TAPi18n.__("Country")},
        optional:true
    }
});

basicsSchema = new SimpleSchema({
    marketplaceEmail: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    marketplaceName: {
	type: String,
        label: function () {return TAPi18n.__('Marketplace name')}
    },
    marketplaceSlogan: {
	type: String,
        label: function () {return TAPi18n.__('Marketplace slogan')}
    },
    marketplaceDescription: {
	type: String,
        label: function () {return TAPi18n.__('Marketplace description')}
    },
    searchPlaceholder: {
	type: String,
        label: function () {return TAPi18n.__('Search help text')}
    },
/*    transactionAgreement: {
	type: Boolean,
        label: function () {return TAPi18n.__('Check to require users to accept an agreement before transaction')},
	optional: true
    },
    agreementLabel: {
	type: String,
        label: function () {return TAPi18n.__('Agreement label')},
	optional: true
    },
    agreementText: {
	type: String,
        label: function () {return TAPi18n.__('Agreement text')},
	optional: true,
        autoform: {
            afFieldInput: {
                type: 'summernote',
                class: 'editor',
		settings: {
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
        }
    },
*/    realAddress: {
	type: entityAddress,
        label: function () {return TAPi18n.__('"Where to find us" footer address')},
        optional:true
    }
});

maillistSchema = new SimpleSchema({
    subject: {
	type: String,
        label: function () {return TAPi18n.__('Subject')}
    },
    message: {
	type: String,
        label: function () {return TAPi18n.__('Message')},
        autoform: {
            afFieldInput: {
                type: 'summernote',
                class: 'editor',
		settings: {
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
        }
     },
    status: {
	type: String,
    },
    reach: {
	type: Number,
	defaultValue: 0
    },
    author: {
        type: String,
        autoValue: function() {
            return Meteor.userId();
        }
    },
    lastSend: {
        type: Date,
	optional:true
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

designSchema = new SimpleSchema({
    desktopLogo: {
        type: String,
        label: function () {return TAPi18n.__('Desktop logo')},
	optional:true,
	autoform: {
	    afFieldInput: {
                type:'fileUpload',
                collection: 'Design'
 	    }
	}
    },
    socialLogo: {
        type: String,
        label: function () {return TAPi18n.__('Logo for social networks and mobile devices')},
	optional:true,
	autoform: {
	    afFieldInput: {
                type:'fileUpload',
                collection: 'Design'
 	    }
	}
    },
    coverPhotoUse: {
        type: Boolean,
        label: function () {return TAPi18n.__('Use cover photo instead of the slider on home page?')},
	autoform: {
	    defaulValue: false
	}
    },
    coverPhoto: {
        type: String,
        label: function () {return TAPi18n.__('Cover photo')},
	optional:true,
	autoform: {
	    afFieldInput: {
                type:'fileUpload',
                collection: 'Design'
 	    }
	}
    },
    stillPhotoUse: {
        type: Boolean,
        label: function () {return TAPi18n.__('Display "ADD YOUR LISTING NOW!" promo after the listings on home page?')},
	autoform: {
	    defaulValue: false
	}
    },
    stillPhoto: {
        type: String,
        label: function () {return TAPi18n.__('Still photo')},
	optional:true,
	autoform: {
	    afFieldInput: {
                type:'fileUpload',
                collection: 'Design'
 	    }
	}
    },
    favicon: {
        type: String,
        label: function () {return TAPi18n.__('Favicon')},
	optional:true,
	autoform: {
	    afFieldInput: {
                type:'fileUpload',
                collection: 'Design'
 	    }
	}
    },
    color: {
        type: String,
        label: function () {return TAPi18n.__('Main theme color')},
        autoform: {
            options: [{label:'Greeen',value:'green'},
		      {label:'Blue', value:'blue'},
		      {label:'Lightblue', value:'lightblue'},
		      {label:'Violet', value:'violet'},
		      {label:'Red', value:'red'},
		      {label:'Turquoise', value:'turquoise'},
		      {label:'Pink', value:'pink'}]
            }
    }/*,
    defaultView: {
        type: String,
        label: function () {return TAPi18n.__('Default browse view')},
        autoform: {
            options: [{label:'Grid',value:'grid'},{label:'List', value:'list'},{label:'Map', value:'map'}]
            }
    }*/
});

oneFilter = new SimpleSchema({
    fieldName: {
	type: String
    },
    active: {
	type: Boolean,
        label: function () {return TAPi18n.__('Display this filter on home page?')}
    },
    title: {
	type: String,
        label: function () {return TAPi18n.__('Filter name')}
    }
});

paymentsSchema = new SimpleSchema({
    minPrice: {
	type: Number,
	decimal:true,
	min:0,
        label: function () {return TAPi18n.__('Minimum listing price')},
        autoform: {
	    defaultValue: 0
	}
    },
    fee: {
	type: Number,
	decimal:true,
	optional:true,
	min:0,
        label: function () {return TAPi18n.__('Fee taken by you from each sale (in dollars)')},
        autoform: {
	    defaultValue: 0
	}
    },
    percentage: {
	type: Number,
	min:0,
	max:10,
	optional:true,
        label: function () {return TAPi18n.__('Percentage taken by you from each sale (in percents)')},
        autoform: {
	    defaultValue: 0
	}
    },
    feeOrPercentage: {
	type: String,
        label: function () {return TAPi18n.__('Do you take Fee or Percentage from each sale?')},
        autoform: {
	    defaultValue: 'fee',
            type: "select-radio-inline",
            options: [{label:'Fee',value:'fee'},
		      {label:'Percentage', value:'percentage'}]
        }
    }
});

mainSchema = new SimpleSchema({
    socialAccounts : {
	type: socialSchema,
	optional:true
    },
    basics: {
	type: basicsSchema,
	optional:true
    },
    design: {
	type: designSchema,
	optional:true
    },
    analytics: {
	type: analyticsSchema,
	optional: true
    },
    instructions: {
	type: instructionsSchema,
	optional: true
    },
    emails: {
	type: emailsSchema,
	optional: true
    },
    settings: {
	type: settingsSchema,
	optional: true
    },
    listingFields: {
	type: [typeListingField]
    },
    defaultListingFields: {
	type: [typeListingField]
    },
    filters: {
	type: [oneFilter],
	optional: true
    },
    publicData: {
	type: Object,
	blackbox:true,
	optional:true
    },
    payments: {
	type: paymentsSchema,
	optional: true
    },
    stripe: {
	type: Object,
	blackbox:true,
	optional:true
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


typesCountSchema = new SimpleSchema({
    listingType: {
	type: String
    },
    amount: {
	type: Number
    } 
});

Maillist.attachSchema(maillistSchema);
Main.attachSchema(mainSchema);
Categories.attachSchema(categoriesSchema);
TypesCount.attachSchema(typesCountSchema);
