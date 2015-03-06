getUserLanguage = function () {
    var language = window.navigator.userLanguage || window.navigator.language;
    language=language[0]+language[1];
    return TAPi18n.getLanguage() || language;
};

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
                "color":"green"
            },
            "staging":
            {
                "marketplaceName": "STAGING",
                "color":"green"
            },
            "production":
            {
                "marketplaceName": "PRODUCTION",
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
	
//setting the right title & color to the html head -> we need to write own html head before app to start in order to have it working quick   
	document.title=Meteor.settings.public.marketplaceName;
	var sc = document.createElement("link");
	sc.setAttribute("rel", "stylesheet");
	sc.setAttribute("id", "theme-stylesheet");
	sc.setAttribute("type", "text/css");
	sc.setAttribute("href", "/css/style."+Meteor.settings.public.color+".css");
	document.head.appendChild(sc);
    });
});
