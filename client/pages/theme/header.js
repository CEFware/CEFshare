UI.registerHelper ('userEmail', function () {
    if (Meteor.user()){
        if (Meteor.user().emails && Meteor.user().emails.length)
            return Meteor.user().emails[0].address;
        if (Meteor.user().services && Meteor.user().services.facebook && Meteor.user().services.facebook.email)
            return Meteor.user().services.facebook.email;
        if (Meteor.user().services && Meteor.user().services.google && Meteor.user().services.google.email)
            return Meteor.user().services.google.email;
    };
    return null;
});

Template.errorMsg.events({
    'click .sendVerEmail': function (event, template) {
	event.preventDefault();
        Meteor.call('sendVerEmail', function (error,result){});
    }
});

Template.restartMsg.events({
    'click .restart': function (event, template) {
	event.preventDefault();
	Session.set('restartApp',null);
        Meteor.call('restartApp', function (e) {
	    if (!e)
		Router.go('/admin');
	});
     }
});

UI.registerHelper('showNewListingButton',function () {
    if (Router.current().lookupTemplate()!=='SpecificListingEdit')
	return true;
    return false;
});

Template.header.helpers({
    loginError: function () {
        if (Accounts._loginButtonsSession.get("errorMessage"))
            return true;
        return false;
    },
    bigLogo: function () {
	var pr=Main.findOne();
	if (pr) {
	    var res=Design.findOne({_id:pr.design.desktopLogo});
	    if (res) 
		return res.url({store:"desktop"});
	};
	return "/img/CEF_logo.png";
    }, 
    smallLogo: function () {
	var pr=Main.findOne();
	if (pr) {
	    var res=Design.findOne({_id:pr.design.socialLogo});
	    if (res)
		return res.url({store:"social"});
	};
	return "/img/CEF_logo_small.png";
    } ,
    restartApp: function () {
	return Session.get('restartApp');
    },
    searchText: function () {
	var res=Main.findOne();
	if (res && res.basics && res.basics.searchPlaceholder)
            return res.basics.searchPlaceholder;
	return TAPi18n.__('Search from here');
 
    }
});
