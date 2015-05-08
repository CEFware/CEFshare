    defaultFields = [
	{
	    name: 'title',
	    title: 'Title',
	    type: 'title'
	},
	{
	    name: 'description',
	    title: 'Description',
	    type: 'description'
	},
	{
	    name: 'details',
	    title: 'Details',
	    type: 'details'
	},
	{
	    name: 'price',
	    title: 'Price',
	    type: 'price'
	},
	{
	    name: 'tags',
	    title: 'Tags',
	    type: 'tags'
	},
	{
	    name: 'tax',
	    title: 'Tax in % (0 - no tax)',
	    type: 'tax'
	},
	{
	    name: 'shippingFee',
	    title: 'Shipping (0 - no shipping)',
	    type: 'shippingFee'
	},
	{
	    name: 'isRibbonSale',
	    title: 'Show ribbon NEW?',
	    type: 'isRibbonSale'
	},
	{
	    name: 'isRibbonNew',
	    title: 'Show ribbon TRENDY?',
	    type: 'isRibbonNew'
	},
	{
	    name: 'isPublic',
	    title: 'Is this listing public?',
	    type: 'isPublic'
	},
	{
	    name: 'active',
	    title: 'Show in slider on homepage?',
	    type: 'active'
	}
    ];

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
	    listingFields: [{listingType: 'Product', listingFields:defaultFields},
			    {listingType: 'Service', listingFields:defaultFields},
			    {listingType: 'Rent', listingFields:defaultFields}]
	};
	Main.insert(query);
    };

});

Meteor.methods({

    getEnv : function () {
	return  (process.env.METEOR_ENV || "development");
    }
});
