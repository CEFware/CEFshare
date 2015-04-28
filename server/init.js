var ListingDefault = {
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
/*    "image.$":{
        autoform: {
            afFieldInput: {
                type:'fileUpload',
                collection: 'Images'
            }
        }
    },
  */  price: {
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
        label: function () {return TAPi18n.__('Is this listing public ?')}
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

};
 

Meteor.startup(function(){
    var environment=Meteor.call ('getEnv');
    var settings = {
        "public": {
            "development":
            {
                "marketplaceName": "DEVELOPMENT",
		"url":"http://localhost:3000/",
                "color":"green"
            },
            "staging":
            {
                "marketplaceName": "STAGING",
		"url":"http://45.56.101.68/",
                "color":"green"
            },
            "production":
            {
                "marketplaceName": "PRODUCTION",
		"url":"http://45.56.101.68/",
                "color":"green"
            }
        },
        "private": {
            "development":
            {
                "path":"/home/shkomg/marketplaces/",
                "supportEmail":"meteor.test.mailbox@mail.com"
            },
            "staging":
            {
                "path":"/root/marketplaces/",
                "supportEmail":"meteor.test.mailbox@mail.com"
            },
            "production":
            {
                "path":"/home/shkomg/marketplaces/",
                "supportEmail":"meteor.test.mailbox@mail.com"
            }
        }
    };

    if (!process.env.METEOR_SETTINGS) {
	console.log("No METEOR_SETTINGS passed in, using locally defined settings.");
	Meteor.settings=settings;
    };

    if (environment === "production") {
	Meteor.settings.public = Meteor.settings.public.production;
	Meteor.settings.private = Meteor.settings.private.production;
    } else if (environment === "staging") {
	Meteor.settings.public = Meteor.settings.public.staging;
	Meteor.settings.private = Meteor.settings.private.staging;
    } else {
	Meteor.settings.public = Meteor.settings.public.development;
	Meteor.settings.private = Meteor.settings.private.development;
    };
    console.log("Using [ " + environment + " ] Meteor.settings");

    Accounts.emailTemplates.siteName = Meteor.settings.public.marketplaceName;
    Accounts.emailTemplates.from = Meteor.settings.public.marketplaceName+" Support <"+Meteor.settings.private.supportEmail+">";

    //setup default data to main collection
    if (Main.find().count()===0) {
	var query={
	    socialAccounts: {
		fbAppId: "",
		fbSecret: "",
		twitterConsumerKey: "ojyyVrU0G11mhMgMDPuPoeWyG",
		twitterSecret: "bssVKnnXSKzVoaoyhty3IcSeE45aJzf3SGwOaHnVlTgwnK1NvV",
		googleClientId: "",
		googleSecret: ""
	    },
	    listingFields: ListingDefault
	};
	Main.insert(query);
    };

});

Meteor.methods({

    getEnv : function () {
	return  (process.env.METEOR_ENV || "development");
    }
});
