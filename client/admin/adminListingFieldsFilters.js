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
    },
    editingTypeName: function (type) {
        if (Session.get('editingTypeName')===type)
            return true;
        return false;
    },
    letEditTypeName: function () {
	if (Main.findOne({'defaultListingFields.listingType':this.listingType}))
            return false;
        return true;
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
    },
    'click .fa-pencil': function (e,t) {
        e.preventDefault();
        Session.set('editingTypeName',this.listingType);
    }
});

Template.editTypeName.events({
    'click .stopEdit': function (e,t) {
        e.preventDefault();
        Session.set('editingTypeName',null);
    },
    'click .saveEdit': function (e,t) {
        e.preventDefault();
        var newName=t.$('.newTypeName').val();
        if (newName.length>0)
            Meteor.call('updateListingType',this.listingType,newName,function (e) {
                if (!e)
		    Session.set('editingTypeName',null);
            });
    }
});

Template.editTypeName.rendered = function () {
    $('.newTypeName').focus();
};
