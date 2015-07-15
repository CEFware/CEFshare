defaultFields = [
	{
	    name: 'title',
	    title: 'Title',
	    type: 'title',
	    optional: false,
	    active: true,
	    authorFilable: true,
	    letDelete: false
	},
	{
	    name: 'description',
	    title: 'Description',
	    type: 'description',
	    optional: false,
	    active: true,
	    authorFilable: true,
	    letDelete: false
	},
	{
	    name: 'details',
	    title: 'Details',
	    type: 'details',
	    optional: false,
	    active: true,
	    authorFilable: true,
	    letDelete: false
	},
	{
	    name: 'price',
	    title: 'Price',
	    type: 'price',
	    optional: false,
	    active: true,
	    authorFilable: true,
	    letDelete: false
	},
	{
	    name: 'itemName',
	    title: 'Item name (item, hour, day etc.)',
	    type: 'itemName',
	    optional: false,
	    active: true,
	    authorFilable: true,
	    letDelete: false
	},
	{
	    name: 'datePick',
	    title: 'Pick needed dates:',
	    type: 'datePick',
	    optional: true,
	    active: true,
	    authorFilable: true,
	    letDelete: false
	},
	{
	    name: 'daysPick',
	    title: 'Set unavailable days of week:',
	    type: 'daysPick',
	    optional: true,
	    active: true,
	    authorFilable: true,
	    letDelete: false
	},
	{
	    name: 'tags',
	    title: 'Tags',
	    type: 'tags',
	    optional: false,
	    active: true,
	    authorFilable: true,
	    letDelete: true
	},
	{
	    name: 'tax',
	    title: 'Tax in % (0 - no tax)',
	    type: 'tax',
	    optional: false,
	    active: true,
	    authorFilable: true,
	    letDelete: true
	},
	{
	    name: 'shippingFee',
	    title: 'Shipping (0 - no shipping)',
	    type: 'shippingFee',
	    optional: false,
	    active: true,
	    authorFilable: true,
	    letDelete: true
	},
	{
	    name: 'isRibbonSale',
	    title: 'Show ribbon NEW?',
	    type: 'isRibbonSale',
	    optional: false,
	    active: true,
	    authorFilable: true,
	    letDelete: true
	},
	{
	    name: 'isRibbonNew',
	    title: 'Show ribbon TRENDY?',
	    type: 'isRibbonNew',
	    optional: false,
	    active: true,
	    authorFilable: true,
	    letDelete: true
	},
	{
	    name: 'isPublic',
	    title: 'Is this listing public?',
	    type: 'isPublic',
	    optional: false,
	    active: true,
	    authorFilable: true,
	    letDelete: false
	},
	{
	    name: 'active',
	    title: 'Show in slider on homepage?',
	    type: 'active',
	    optional: false,
	    active: true,
	    authorFilable: true,
	    letDelete: true
	}
    ];

defaultFieldsRent=defaultFields;
defaultFieldsRent.splice(9,1);
defaultFieldsService=defaultFields;
defaultFieldsService.splice(9,1);

var authorNonFilableFieldsTitles=['appStart', 'appEnd', 'appDuration', 'address'];

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
                "supportEmail":"meteor.test.mailbox@gmail.com"
            },
            "staging":
            {
                "path":"/root/marketplaces/",
                "supportEmail":"meteor.test.mailbox@gmail.com"
            },
            "production":
            {
                "path":"/home/shkomg/marketplaces/",
                "supportEmail":"meteor.test.mailbox@gmail.com"
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

    if ((Meteor.users.find().count() === 0) && (Main.find().count()===0)) {
	//This code will be executed only if it's the first start of a application installation
	//(or database was dropped, with meteor reset)
	console.log('Welcome to your fresh Marketplace. This is the first startup of this application');
	console.log('We are preparing your application for first run... Please wait several minutes :-) !')

	//Create the user admin with password login
	var admin = Accounts.createUser({
            email: 'admin@admin.com',
            password: 'aaaaaa1',
            username: 'admin',
	});

	Roles.addUsersToRoles(admin, ['admin','verified'], Roles.GLOBAL_GROUP);

	//setup default data to main collection
	var query={
	    socialAccounts: {
		fbAppId: "",
		fbSecret: "",
		twitterConsumerKey: "ojyyVrU0G11mhMgMDPuPoeWyG",
		twitterSecret: "bssVKnnXSKzVoaoyhty3IcSeE45aJzf3SGwOaHnVlTgwnK1NvV",
		googleClientId: "",
		googleSecret: ""
	    },
	    design: {
		color: "green",
		defaultView: "grid",
		coverPhotoUse:false,
		stillPhotoUse:true
	    },
	    listingFields: [{listingType: 'Product', listingFields:defaultFields},
			    {listingType: 'Service', listingFields:defaultFieldService,
			    {listingType: 'Rent', listingFields:defaultFieldsRent}],
	    defaultListingFields: [{listingType: 'Product', listingFields:defaultFields},
			    {listingType: 'Service', listingFields:defaultFieldsService},
			    {listingType: 'Rent', listingFields:defaultFieldsRent},
			    {listingType: 'DEFAULT', listingFields:defaultFields}],
	    authorNonFilableFields: authorNonFilableFieldsTitles 
	};
	Main.insert(query);
    };
    
    var main=Main.findOne();
    if (main && main.basics && main.basics.marketplaceName) {
	var title="<title>"+main.basics.marketplaceName+"</title>";
    } else {
	var title="<title>"+TAPi18n.__('CEF new marketplace')+"</title>";
    };
    if (main && main.design && main.design.color) {
	var style='<link rel="stylesheet" id="theme-stylesheet" type="text/css" href="/css/style.'+main.design.color+'.css">';
    } else {
	var style='<link rel="stylesheet" id="theme-stylesheet" type="text/css" href="/css/style.green.css">';
    };
    if (main && main.design && main.design.favicon && Design.findOne({_id:main.design.favicon})) {
	res = Design.findOne({_id:main.design.favicon}).url({store:"favicon"});
    } else {
	res = "/img/CEF_favicon.png";
    };
    var favicon='<link rel="shortcut icon" type="text/css" href="'+res+'">';

    if (!Package.appcache)
	WebApp.connectHandlers.use(function(req, res, next) {
	    if(Inject.appUrl(req.url)) {
		Inject.rawModHtml('myHead', function (html) { 
		    return html.replace(/<replace>/,title+style+favicon);
		});
	    }
	    next();
	});
});

Meteor.methods({

    getEnv : function () {
	return  (process.env.METEOR_ENV || "development");
    }
});
Meteor.startup(function () {
    //replaced the default mailURL to our mailgun mail credential
    process.env.MAIL_URL = 'smtp://postmaster@sandboxd6ac22f092a944dba6889033365ce18d.mailgun.org:0963b1bc2e079b4b918daeacc59e624a@smtp.mailgun.org:587';
});


