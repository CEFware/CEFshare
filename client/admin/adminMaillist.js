Template.adminMaillist.helpers({
    maillistSchemaObj: function() {
        return maillistSchema;
    }
});

AutoForm.addHooks(['sendBroadcastMessage'],{
    onSuccess: function (){
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});
