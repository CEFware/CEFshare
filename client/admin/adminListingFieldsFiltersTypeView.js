Template.adminListingFieldsFiltersTypeView.helpers({
    listingFields: function () {
	var res=Main.findOne();
	if (res) {
	    var fin=[];
	    res.listingFields.forEach(function (el) {
		if (el.listingType===Router.current().params.listingType)
		    fin=el.listingFields;
	    });
	    return fin;
	};
    },
    listingFieldsDefault: function () {
	var res=ListingDefault;
	if (res) {
	    res=_.keys(res._schema);
	    var fin=[];
	    res.forEach(function (el) {
		if (ListingDefault._schema[el].label && (el.indexOf("$")<0))
		    fin.push({type:el,name:el,title:ListingDefault._schema[el].label});
	    });
	    return fin;
	};
    },
    currentType: function () {
        return Router.current().params.listingType;
    },
    oneListingFieldObj: function () {
	return oneListingField;
    },
    getTitle: function () {
	var res=$("[name=type]").val();
	if (res)
	    return res;
    }
});

Template.adminListingFieldsFiltersTypeView.rendered = function () {
    Meteor.subscribe('appSettings');
};

Template.adminListingFieldsFiltersTypeView.events({
    'change [name=type]': function () {
	var res=$("[name=type]").val();
	if (res) {
	    $("[name=title]").attr("placeholder", ListingMain._schema[res].label);
	} else {
	    $("[name=title]").attr("placeholder", TAPi18n.__("Type a Title for new listing field here"));
	};
    }
});


AutoForm.addHooks(['adminListingTypeNewField'],{
    onSuccess: function (){
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});

