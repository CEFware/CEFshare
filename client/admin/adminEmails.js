Template.adminEmails.helpers({
    emailsSchemaObj: function() {
        return emailsSchema;
    }
});

AutoForm.addHooks(['adminEmails'],{
    onSuccess: function (){
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});
