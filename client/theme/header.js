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
    }
});
