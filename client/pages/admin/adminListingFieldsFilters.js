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
    },
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

AutoForm.addHooks(['adminListingTypes'],{
    onSuccess: function (){
        Materialize.toast(TAPi18n.__("Thank you!"),2000);
    }
});

AutoForm.addHooks(['adminFilterUpdate'],{
    onSuccess: function (){
        Materialize.toast(TAPi18n.__("Thank you!"),2000);
    }
});

Template.adminListingFieldsFilters.rendered = function () {
    Meteor.subscribe('appSettings');
    Meteor.subscribe('typesCount');
};

Template.adminListingFieldsFilters.events({
    'click .deleteType': function (e,t) {
	e.preventDefault();
	if (confirm(TAPi18n.__("Are you sure you want to delete this listing type?")))
	    Meteor.call('deleteListingType',this.listingType, function (e,r){
		if (!e) 
		    Session.set('restartApp',true);
	    });
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


Template.adminListingFieldsFilters.onRendered(function(){
    $('.collapsible').collapsible({
        accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
    $('select').material_select();
    $('.modal-trigger').leanModal();
});
