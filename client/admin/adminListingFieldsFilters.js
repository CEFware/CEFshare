Template.adminListingFieldsFilters.helpers({
    listingTypes: function () {
	var res =Main.findOne();
	if (res)
	    return res.listingFields;
    },
    typesSchemaObj: function () {
	return typeListingField;
    },
    letDelete : function (obj) {
	var res=TypesCount.findOne({listingType:obj.listingType});
	if (res && (res.amount>0))
	    return false;
	return true;
    },
    countListings : function (name) {
	var res=TypesCount.findOne({listingType:name});
	if (res)
	    return res.amount;
    }
});

AutoForm.addHooks(['adminListingTypes'],{
    onSuccess: function (){
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});

Template.adminListingFieldsFilters.rendered = function () {
    Meteor.subscribe('appSettings');
    Meteor.subscribe('typesCount');
};

Template.adminListingFieldsFilters.events({
    'click .fa-trash': function (e,t) {
	e.preventDefault();
	Meteor.call('deleteListingType',this.listingType);
    }
});

