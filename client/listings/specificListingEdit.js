AutoForm.addHooks(['specificListingEdit'],{
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
    onError: function () {}
});

AutoForm.addHooks(['specificListingCreate'],{
    after: {
	"method": function (e,r,t) {
	    Router.go('specificListingEdit', {uri:r})
	}
    }
});

Template.specificListingEdit.helpers({
    currentListing: function () {
	return specificListingByURI(Router.current().params.uri).fetch().first();
    },
    newListing: function (){
	if (Router.current().params.uri==='new')
	    return true;
	return false;
    },
    listingSchema: function () {
	return Listing;
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
    }

});

Template.specificListingEdit.rendered = function () {
    var obj=null;
    if (Router.current().params.uri!=='new') {
	obj=specificListingByURI(Router.current().params.uri).fetch().first();
	$('#tokenfield').tokenfield({
	    tokens: obj.tags
	});
    } else {
	$('#tokenfield').tokenfield();
    };
    if (obj) {
	Meteor.subscribe('images',[obj.image]);
    } else {
	Meteor.subscribe('images');
    };
};
