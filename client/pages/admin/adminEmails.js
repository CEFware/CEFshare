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
        Materialize.toast(TAPi18n.__("Thank you!"),2000);
    }
});

Template.adminEmails.onRendered( function () {
    Meteor.subscribe('appSettings');
    $('.ck-editor').ckeditor();
    $('.ck-editor').parent().children('label').remove();
});
