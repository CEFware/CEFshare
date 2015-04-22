Template.adminSocial.helpers({
    socialSchemaObj: function() {
        return socialSchema;
    }
});

AutoForm.addHooks(['adminSocial'],{
    onSuccess: function (){
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});
