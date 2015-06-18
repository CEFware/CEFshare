Template.adminInvite.helpers({
    inviteSchemaObj: function() {
        return inviteSchema;
    }
});

AutoForm.addHooks(['sendBroadcastInvite'],{
    onSuccess: function (){
        Flash.success(1,TAPi18n.__("Your invites went out. Thank you!"),2000);
    }
});
