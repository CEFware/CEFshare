Template.adminAnalytics.helpers({
    analyticsSchemaObj: function() {
        return analyticsSchema;
    }
});

AutoForm.addHooks(['adminAnalytics'],{
    onSuccess: function (){
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});
