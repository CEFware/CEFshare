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
Template.adminInvite.onRendered(function(){
    $('.ck-editor').ckeditor();
    $('.ck-editor').parent().children('label').remove();
    $('.ck-editor').parent().prepend('<h6>Message</h6>');
    $('.txt-subject').parent().addClass('col s6');

});
