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
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});

Template.adminSocial.rendered = function () {
    Meteor.subscribe('appSettings');
};
