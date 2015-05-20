Template.adminListingFieldsFiltersFieldFilter.helpers({
    fieldName: function () {
	return Router.current().params.field; 
    },
    oneFilterObj: function () {
	return oneFilter;
    },
    fieldTitle: function () {
	if (Router.current().params.field === 'listingType') 
	    return ListingDefault._schema.listingType.label();
	return _.filter(_.filter(Main.findOne().listingFields,function (el) {
	    return el.listingType=== Router.current().params.listingType})[0].listingFields, function (el2) {return el2.type===Router.current().params.field})[0].title;
    },
    filterObj: function () {
	res=_.filter(Main.findOne().filters, function (el) {return el.fieldName===Router.current().params.field})[0];
	if (res)
	    return res;
	return {title:'',active:false,fieldName:Router.current().params.field};
    }
});

Template.adminListingFieldsFiltersFieldFilter.rendered = function () {
    Meteor.subscribe('appSettings');
};

AutoForm.addHooks(['adminFilterUpdate'],{
    onSuccess: function (){
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});

