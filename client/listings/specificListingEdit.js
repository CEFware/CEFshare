AutoForm.addHooks(['specificListingEdit'],{
    docToForm: function(doc) {
	if (_.isArray(doc.tags)) {
            doc.tags = doc.tags.join(",");
	};
	return doc;
    },
    formToDoc: function(doc) {
	if (typeof doc.tags === "string") {
            doc.tags = (doc.tags.split(",")).trim();
	}
	return doc;
    },
    onSuccess: function (o,r,t) {
	if (t.data.doc)
	    t.$('#tokenfield').tokenfield({tags:t.data.doc.tags});
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
