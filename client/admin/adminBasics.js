Template.adminBasics.helpers({
    basicsSchemaObj: function() {
        return basicsSchema;
    }
});

AutoForm.addHooks(['adminBasics'],{
    onSuccess: function (){
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});
