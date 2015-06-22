Template.adminInvite.helpers({
    inviteSchemaObj: function() {
        return inviteSchema;
    }
});

AutoForm.addHooks(['sendBroadcastInvite'],{
    onSuccess: function (){
        Materialize.toast(TAPi18n.__("Your invites went out. Thank you!"),2000);
    }
});
