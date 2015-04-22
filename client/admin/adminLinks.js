Template.adminLinks.helpers({
    linksSchemaObj: function() {
        return linksSchema;
    }
});

AutoForm.addHooks(['adminLinks'],{
    onSuccess: function (){
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});
