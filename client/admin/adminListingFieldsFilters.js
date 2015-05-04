Template.adminListingFieldsFilters.helpers({
    listingTypes: function () {
	var res =Main.findOne();
	if (res)
	    return res.listingFields;
    },
    typesSchemaObj: function () {
	return typeListingField;
    }
});

AutoForm.addHooks(['adminListingTypes'],{
    onSuccess: function (){
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});

Template.adminListingFieldsFilters.rendered = function () {
    Meteor.subscribe('appSettings');
};

