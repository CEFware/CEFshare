Template.adminEmails.helpers({
    emailsSchemaObj: function() {
        return emailsSchema;
    },
    mainEmails: function (){
        var res=Main.findOne();
        if (res)
            return res.emails;
     }
});

AutoForm.addHooks(['adminEmails'],{
    onSuccess: function (){
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});

Template.adminEmails.rendered = function () {
    Meteor.subscribe('appSettings');
};
