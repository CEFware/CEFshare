Meteor.startup(function () {

    Array.prototype.first = function () {
        return this[0];
    };

    //we may add here our own templates for sign in / up if needed
    AccountsEntry.config({
        homeRoute: '/',                    // mandatory - path to redirect to after sign-out
        dashboardRoute: '/',      // mandatory - path to redirect to after successful sign-in
        showOtherLoginServices: true
    });

    currentUserEmail = function (userObj) {

        if (userObj && userObj.username) {
            var userObj=Meteor.users.findOne({username:userObj.username})
        } else {
            userObj=Meteor.user();
        };

        if (userObj){
            if (userObj.emails && userObj.emails.length)
                return userObj.emails[0].address;
            if (userObj.profile && userObj.profile.email)
                return userObj.profile.email;
            if (userObj.services && userObj.services.facebook && userObj.services.facebook.email)
                return userObj.services.facebook.email;
            if (userObj.services && userObj.services.google && userObj.services.google.email)
                return userObj.services.google.email;
        };
        return null;
    };
});

AccountsTemplates.configure({
    showAddRemoveServices: true
});
