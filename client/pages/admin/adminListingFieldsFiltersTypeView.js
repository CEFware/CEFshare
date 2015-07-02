Template.adminListingFieldsFiltersTypeView.helpers({
    listingFields: function () {
	var res=Main.findOne();
	if (res) {
	    var fin=[];
	    var lType=this.type;
	    fin = _.filter(res.listingFields, function (el) {
		return (el.listingType===lType)
	    });
	    if (fin[0]) {
		fin = _.filter(fin[0].listingFields, function (el) {
		    var act=Session.get('showInactive');
		    if (act && act[lType]) {
			return true;
		    } else {
			return (el.active);
		    };
		});
		return fin;
	    };
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
        return Template.parentData(1).type;
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
	    var lType=this.type;
	    res.listingFields.forEach(function (el) {
		if (el.listingType===lType)
		    el.listingFields.forEach(function (el2){
			if (!el2.active)
			    fin++;
		    });
	    });
	    return fin;
	};
    },
    showInactive: function () {
	var res = Session.get('showInactive');
	if (res)
	    return res[this.type];
	return false;
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
    'click .inactive': function (e,t) {
	var res=Session.get('showInactive');
	if (res) {
	    if (typeof res[t.data.type] === 'undefined') {
		res[t.data.type]=true;
	    } else {
		res[t.data.type]=!res[t.data.type];
	    };
	} else {
	    res={};
	    res[t.data.type]=true;
	};
	Session.set('showInactive',res);
    },
    'click .fieldDelete': function (e,t) {
	Meteor.call('deleteListingField',this,t.data.type, function(e,r) {
	    if (!e)
		Session.set('restartApp',true);
	});
    },
    'click .fieldActivate': function (e,t) {
	Meteor.call('deleteListingField',this,t.data.type, function(e,r) {
	    if (!e)
		Session.set('restartApp',true);
	});
    },
    'click .editField': function (e,t) {
        e.preventDefault();
        Session.set('editingField',this.name);
    },
    'click .filterEdit': function (e,t) {
        e.preventDefault();
	$('#renderedId').remove();
	var x=renderTmp(Template.filtersModal,{title:this.title, name:this.name, type:t.data.type});
	$('#modal2').openModal();
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
	if (this.title.length>0) {
            Meteor.call('updateListingField',this,Template.parentData(1).type,function (e) {
		if (!e)
                    Session.set('editingField',null);
            });
};
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
        Materialize.toast(TAPi18n.__("Thank you! <b>The app will be reloaded in a minute for changes to take place</b>"),4000);
        Session.set('restartApp',true);
    }
});

Template.filtersModal.helpers({
    fieldName: function () {
        return this.name;
    },
    oneFilterObj: function () {
        return oneFilter;
    },
    fieldTitle: function () {
	if (typeof this.title==='function')
	    return this.title();
	return this.title;
    },
    filterObj: function () {
	var fName=this.name;
        res=_.filter(Main.findOne().filters, function (el) {return el.fieldName===fName})[0];
        if (res)
            return res;
        return {title:'',active:false,fieldName:this.name};
    }
});
