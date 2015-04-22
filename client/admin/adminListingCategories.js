Template.adminListingCategories.helpers({
    categoriesSchemaObj: function() {
        return categoriesSchema;
    }
});

AutoForm.addHooks(['adminListingCategories'],{
    onSuccess: function (){
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});
