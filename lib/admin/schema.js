Maillist = new Mongo.Collection('maillist');

Main = new Mongo.Collection('main');

Categories = new Mongo.Collection('categories');

SimpleSchema.messages({duplicateFound: 'Duplicate found!'});

inviteSchema = new SimpleSchema({
    emails: {
	type: String,
        label: function () {return TAPi18n.__('Emails')}
     },
    message: {
	type: String,
        label: function () {return TAPi18n.__('Message')}
    }
});

oneLinkSchema = new SimpleSchema({
    title: {
	type: String,
        label: function () {return TAPi18n.__('Title')}
    },
    url: {
	type: String,
        label: function () {return TAPi18n.__('URL')}
    }
});

linksSchema = new SimpleSchema({
    links: {
	type: [oneLinkSchema],
	optional: true
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
});

instructionsSchema = new SimpleSchema({
    signupInfo: {
	type: String,
        label: function () {return TAPi18n.__('Signup info')},
	optional: true,
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
    }
});

socialSchema = new SimpleSchema({
    twitterHandle: {
	type: String,
        label: function () {return TAPi18n.__('Twitter handle')},
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

basicsSchema = new SimpleSchema({
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
    transactionAgreement: {
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
    status: {
	type: String,
    },
    reach: {
	type: Number,
        autoValue: function() {
            return Meteor.users.find().count();
        }
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

mainSchema = new SimpleSchema({
    socialAccounts : {
	type: socialSchema,
	optional:true
    },
    basics: {
	type: basicsSchema,
	optional:true
    },
    menuLinks: {
	type: linksSchema,
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
	type: Object,
	blackbox:true
    },
    publicData: {
	type: Object,
	blackbox:true,
	optional:true
    }
    
    
});


Maillist.attachSchema(maillistSchema);
Main.attachSchema(mainSchema);
Categories.attachSchema(categoriesSchema);
