Template.adminSettings.helpers({
    settingsSchemaObj: function() {
        return settingsSchema;
    }
});

AutoForm.addHooks(['adminSettings'],{
    onSuccess: function (){
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});
