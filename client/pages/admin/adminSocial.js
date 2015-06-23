Template.adminSocial.helpers({
    socialSchemaObj: function() {
        return socialSchema;
    },
    mainSocial: function () {
	var res=Main.findOne();
	if (res)
	    return res.socialAccounts;
    }
});

AutoForm.addHooks(['adminSocial'],{
    onSuccess: function (){
        window.scrollTo(0,0);
        Materialize.toast(TAPi18n.__("Thank you! <b>The app will be reloaded in a minute for changes to take place</b>"),4000);
        Session.set('restartApp',true);
    }
});

Template.adminSocial.rendered = function () {
    Meteor.subscribe('appSettings');
};
