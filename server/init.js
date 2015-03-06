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

});

Meteor.methods({

    getEnv : function () {
	return  (process.env.METEOR_ENV || "development");
    }
});
