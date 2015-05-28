AutoForm.addHooks(['specificListingEdit'],{
});

AutoForm.addHooks(['specificListingCreate'],{
    docToForm: function(doc) {
	if (_.isArray(doc.tags)) {
            doc.tags = doc.tags.join(", ");
	};
	return doc;
    },
    formToDoc: function(doc) {
	if (typeof doc.tags === "string") {
            doc.tags = (doc.tags.split(",")).trim();
	}
	return doc;
    },
    onSuccess: function () {
	if (this.template.data.doc)
	    this.template.$('#tokenfield').tokenfield({tags:this.template.data.doc.tags});
	    Flash.success('listingSaved',TAPi18n.__("Saved successfuly!"),2000);
    },    
    onError: function () {},
    after: {
	"method": function (e,r,t) {
	    var curCat=Session.get('listingCategory');
	    var curL=specificListingByURI(r).fetch().first();
	    if (curL) {
		Meteor.call('setListingCategory',curL._id,curCat);
	    };
	    if (!e)
		Router.go('specificListingEdit', {uri:r})
	}
    }
});

Template.specificListingEdit.helpers({
    currentListing: function () {
        if (Router.current().params.uri==='new')
            return '';
  	return specificListingByURI(Router.current().params.uri).fetch().first();
    },
    newListing: function (){
	if (Router.current().params.uri==='new')
	    return true;
	return false;
    },
    listingSchema: function () {
        if (Router.current().params.uri==='new')
	    return Listing;
  	return '';
    },
    appUrl: function () {
	return Meteor.settings.public.url;
    },
    listingTypeGet: function () {
	var res=Session.get('listingType');
	if (res)
	    return res;
	return Main.findOne().listingFields[0].listingType;
    },
    listingTypes: function () {
	return Main.findOne().listingFields;
    },
    ifSelected: function () {
	var curType=Session.get('listingType');
	if (curType) {
	    if (this.listingType===curType)
		return 'selected';
	    return '';
	} else {
	    if (this.listingType===Main.findOne().listingFields[0].listingType)
		return 'selected';
	    return '';
	};
    },
    ifCategorySelected: function () {
	var curCat=Session.get('listingCategory');
	if (curCat) {
	    if (this.name===curCat[0])
		return 'selected';
	    return '';
	};
    },
    ifSubCategorySelected: function () {
	var curCat=Session.get('listingCategory');
	if (curCat) {
	    if (this.name===curCat[1])
		return 'selected';
	    return '';
	};
    },
    ifCategorySelectedHasSub: function () {
	var curCat=Session.get('listingCategory');
	if (curCat && curCat.length>0) {
	    var children=Categories.find({parent:curCat[0]})
	    if (children.count()>0)
		return true;
	};
	return false;
    },
    listingParentCategories: function () {
	return Categories.find({parent:{$exists:false}});
    },
    listingChildrenCategories: function () {
	var curCat=Session.get('listingCategory');
	if (curCat) {
	    return Categories.find({parent:curCat[0]});
	}
    },
    customFields: function () {
	//return only custom fields
	var curType=Session.get('listingType');
	var custF=[];
	var defF=[];
	if (curType) {
	    Main.findOne().listingFields.forEach(function (el) {
		if (el.listingType===curType)
		    custF=el.listingFields;
	    });
	    if (!Main.findOne({'defaultListingFields.listingType':curType}))
		curType='DEFAULT';
	    Main.findOne().defaultListingFields.forEach(function (el) {
		if (el.listingType===curType)
		    defF=el.listingFields;
	    });

	    var resF=_.filter(custF,function (obj) {return !_.findWhere(defF, obj)});

	    return _.filter(resF,function (obj) {return (obj.authorFilable && obj.active)});
	};
    },
    showField: function (name) {
	var pre=_.filter(Main.findOne().listingFields,function (el) {return el.listingType===Session.get('listingType')});
	if (pre.length>0) {
	    var res = _.filter(pre[0].listingFields, function (el2) {return el2.name===name});
	    if (res.length>0) 
		return res[0].active;
	};
	return false;
    },
    formType: function () {
        if (Router.current().params.uri==='new')
            return 'method';
        return 'update';
    },
    formMethod: function () {
        if (Router.current().params.uri==='new')
            return 'createNewListing';
        return '';
    },
    formCollection: function () {
        if (Router.current().params.uri==='new')
            return '';
        return "Listings";
    } 
});

Template.specificListingEdit.events({
    'click .cancelEditListing': function (event,template) {
	event.preventDefault();
	var uri=Router.current().params.uri;
	if (uri==='new') {
	    Router.go('home');
	} else {
	    Router.go('specificListing',{uri:uri});
	};
    },
    'change #listingType': function (e,t) {
	event.preventDefault();
        Session.set('listingType',e.currentTarget.value);
    },
    'change #listingCategory': function (e,t) {
	event.preventDefault();
	var curCat=Session.get('listingCategory');
	var curL=specificListingByURI(Router.current().params.uri).fetch().first();
	if (curCat) {
	    curCat[0]=e.currentTarget.value;
	} else {
	    curCat=[e.currentTarget.value];
	};
	if (curL) {
	    Meteor.call('setListingCategory',curL._id,curCat);
	};
        Session.set('listingCategory',curCat);
    },
    'change #listingSubCategory': function (e,t) {
	event.preventDefault();
	var curCat=Session.get('listingCategory');
	var curL=specificListingByURI(Router.current().params.uri).fetch().first();
	curCat[1]=e.currentTarget.value;
	if (curL) {
	    Meteor.call('setListingCategory',curL._id,curCat);
	};
        Session.set('listingCategory',curCat);
    }

});

Template.specificListingEdit.rendered = function () {
    Meteor.subscribe('categories');
    
    var obj=null;
    if (Router.current().params.uri!=='new') {
	obj=specificListingByURI(Router.current().params.uri).fetch().first();
	$('#tokenfield').tokenfield({
	    tokens: obj.tags
	});
	//set current listing type
	Session.set('listingType',obj.listingType);
	//set current listing categories
	Tracker.autorun(function () {
	    var curCat=[];
	    var res=Categories.findOne({listings:obj._id,parent:{$exists:false}});
	    if (res)
		curCat[0]=res.name;
	    var res2=Categories.findOne({listings:obj._id,parent:curCat[0]});
	    if (res2)
		curCat[1]=res2.name;
	    if (curCat)
		Session.set('listingCategory',curCat);
	});
    } else {
	$('#tokenfield').tokenfield();
	//set default listing type
	Session.set('listingType',Main.findOne().listingFields[0].listingType);
    };
    if (obj) {
	Meteor.subscribe('images',[obj.image]);
    } else {
	Meteor.subscribe('images');
    };
};
