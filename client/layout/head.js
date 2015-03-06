Meteor.startup(function() {
    if (Meteor.settings) {
	document.title=Meteor.settings.public.marketplaceName;
	var sc = document.createElement("link");
	sc.setAttribute("rel", "stylesheet");
	sc.setAttribute("id", "theme-stylesheet");
	sc.setAttribute("type", "text/css");
	sc.setAttribute("href", "/css/style."+Meteor.settings.public.color+".css");
	document.head.appendChild(sc);
    };
});
