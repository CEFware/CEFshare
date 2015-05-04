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
    currentType: function () {
        return Router.current().params.listingType;
    }
});

Template.adminListingFieldsFiltersTypeView.rendered = function () {
    Meteor.subscribe('appSettings');
};

