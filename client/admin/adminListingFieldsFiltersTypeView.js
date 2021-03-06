Template.adminListingFieldsFiltersTypeView.helpers({
    listingFields: function () {
	var res=Main.findOne();
	if (res) {
	    var fin=[];
	    res.listingFields.forEach(function (el) {
		if (el.listingType===Router.current().params.listingType)
		    el.listingFields.forEach(function (el2) {
			if (Session.get('showInactive')) {
			    fin.push(el2);
			} else {
			    if (el2.active)
				fin.push(el2);
			};
		    });
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
    },
    countInactive: function () {
	var res=Main.findOne();
	if (res) {
	    var fin=0;
	    res.listingFields.forEach(function (el) {
		if (el.listingType===Router.current().params.listingType)
		    el.listingFields.forEach(function (el2){
			if (!el2.active)
			    fin++;
		    });
	    });
	    return fin;
	};
    },
    showInactive: function () {
	return Session.get('showInactive');
    },
    editingField: function (name) {
        if (Session.get('editingField')===name)
            return true;
        return false;
    },
    letEditField: function () {
        if (Main.findOne({'defaultListingFields.listingFields.title':this.title}))
            return false;
        return true;
     },
    letDefaultFilter: function () {
	return this.name==='listingType';
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
    },
    'click .showInactive': function () {
	Session.set('showInactive',true);
    },
    'click .hideInactive': function () {
	Session.set('showInactive',null);
    },
    'click .fieldDelete': function () {
	Meteor.call('deleteListingField',this,Router.current().params.listingType, function(e,r) {
	    if (!e)
		Session.set('restartApp',true);
	});
    },
    'click .fieldActivate': function () {
	Meteor.call('deleteListingField',this,Router.current().params.listingType, function(e,r) {
	    if (!e)
		Session.set('restartApp',true);
	});
    },
    'click .editField': function (e,t) {
        e.preventDefault();
        Session.set('editingField',this.name);
    }
});


Template.editFieldName.events({
    'click .stopEdit': function (e,t) {
        e.preventDefault();
        Session.set('editingField',null);
    },
    'click .saveEdit': function (e,t) {
        e.preventDefault();
	this.title=t.$('#'+this.name).val();
	this.optional=t.$('.fieldOptional').is(':checked');
	this.authorFilable=t.$('.authorFilable').is(':checked');
	if (this.title.length>0)
            Meteor.call('updateListingField',this,Router.current().params.listingType,function (e) {
		if (!e)
                    Session.set('editingField',null);
            });
    }
});

Template.editFieldName.rendered = function () {
    $('.newFieldName').focus();
};

Template.editFieldName.helpers({
    ifOptional: function () {
	if (this.optional)
	    return 'checked';
    },
    ifAuthorFilable: function () {
	if (this.authorFilable)
	    return 'checked';
    }
});


AutoForm.addHooks(['adminListingTypeNewField'],{
    onSuccess: function (){
        window.scrollTo(0,0);
        Flash.success(1,TAPi18n.__("Thank you! <b>The app will be reloaded in a minute for changes to take place</b>"),4000);
        Session.set('restartApp',true);
    }
});

