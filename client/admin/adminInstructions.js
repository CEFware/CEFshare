Template.adminInstructions.helpers({
    instructionsSchemaObj: function() {
        return instructionsSchema;
    }
});

AutoForm.addHooks(['adminInstructions'],{
    onSuccess: function (){
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});
