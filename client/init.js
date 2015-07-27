getUserLanguage = function () {
    var language = window.navigator.userLanguage || window.navigator.language;
    language=language[0]+language[1];
    return TAPi18n.getLanguage() || language;
};

Accounts.onLogin(function() {
    //if there is a session with some listings - add it to user.recentListings - and add all that together cutted to 10 back to session
    var current=Cookie.get('recentListings');
    if (current) {
        current = current.split(",");
	var mres=Meteor.user();
	if (mres && mres.profile && mres.profile.recentListings) {
	    current= _.union(current, Meteor.user().profile.recentListings);
	    if (current.length>10) 
		current=_.rest(current,current.length-10);
            Cookie.set('recentListings',current.join(','));
	    Meteor.users.update({_id:Meteor.userId()},{$set:{'profile.recentListings':current}});
	} else {
	    Meteor.users.update({_id:Meteor.userId()},{$set:{'profile.recentListings':current}});
	};
    } else if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.recentListings) {
	current=Meteor.user().profile.recentListings;
	if (current.length>10) 
	    current=_.rest(current,current.length-10);
        Cookie.set('recentListings',current.join(','));
    };
    
/*
//this is commented as it looks like there is a conflict with one onLogin in accounts-meld which got an error after update to Meteor 1.0.4.1
    if (Meteor.user() && (!(Meteor.user().emails[0].address))) {
        Router.go('userProfileEdit',{username:Meteor.user().username});
    };
*/

});

Meteor.startup(function() {
//preparing for internationalization

    Session.set("showLoadingIndicator", true);

    TAPi18n.setLanguage(getUserLanguage())
      .done(function () {
        Session.set("showLoadingIndicator", false);
      })
      .fail(function (error_message) {
        // Handle the situation
        console.log(error_message);
      });


//working with settings.json
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
        }
    };

    if (!Meteor.settings) {
        console.log("No METEOR_SETTINGS passed in, using locally defined settings.");
        Meteor.settings=settings;
    };

    Meteor.call ('getEnv', function (error,environment) {
	if (environment === "production") {
            Meteor.settings.public = Meteor.settings.public.production;
	} else if (environment === "staging") {
            Meteor.settings.public = Meteor.settings.public.staging;
	} else {
            Meteor.settings.public = Meteor.settings.public.development;
	};
	console.log("Using [ " + environment + " ] Meteor.settings");
    });
});
