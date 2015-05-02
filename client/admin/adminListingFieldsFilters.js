Template.adminListingFieldsFilters.helpers({
    categoriesSchemaObj: function() {
        return categoriesSchema;
    },
    categoriesParents: function() {
        var res=Categories.find({parent:{$exists:false}}).fetch();
        if (res.length>0)
            return res;
    },
    categoriesChildren: function() {
        var res=Categories.find({parent:this.name}).fetch();
        if (res.length>0)
            return res;
    },
    listingTypes: function () {
	return Main.findOne().listingFields;
    }
});

AutoForm.addHooks(['adminListingCategories'],{
    onSuccess: function (){
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});

Template.adminListingFieldsFilters.rendered = function () {
    Meteor.subscribe('appSettings');
};

