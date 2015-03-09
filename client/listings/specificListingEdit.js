AutoForm.addHooks(['specificArtworkEdit'],{
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
    onSuccess: function (o,r,t) {
	if (t.data.doc)
	    t.$('#tokenfield').tokenfield({tags:t.data.doc.tags});
	    Flash.success('artworkSaved',"Saved successfuly!",2000);
    },    
    onError: function () {}
});

AutoForm.addHooks(['specificArtworkCreate'],{
    after: {
	"createNewArtwork": function (e,r,t) {
	    Router.go('specificArtworkEdit', {name:r})
	}
    }
});

Template.specificArtworkEdit.helpers({
    currentArtwork: function () {
	return specificArtworkWithCanonicalTitle(Router.current().params.name).fetch().first();
    },
    currentArtworkProducts: function () {
	var ses=Session.get('productsAddedToArtwork');
	if (!ses)
	    ses=[];
	return ses;
    },
    newArtwork: function (){
	if (Router.current().params.name==='new')
	    return true;
	return false;
    },
    artworkSchema: function () {
	return Schema.ArtworksPage;
    }
});

Template.specificArtworkEdit.events({
    'click .deleteProductFromArtwork':function (event,template){
        var ses=Session.get('productsAddedToArtwork');
        var pId=template.$(event.target).data('product-id');
        if (pId && ses){
            ses=_.without(ses,pId);
            Session.set('productsAddedToArtwork',ses);
        };
    },

    'click .deleteAllProductsFromArtwork':function (event,template){
	event.preventDefault();
	Session.set('productsAddedToArtwork',null)
    },

    'click .cancelEditArtwork': function (event,template) {
	event.preventDefault();
	Router.go('SpecificArtwork',{name:Router.current().params.name});
    }

});

Template.specificArtworkEdit.rendered = function () {
    var obj=null;
    if (Router.current().params.name!=='new') {
	obj=specificArtworkWithCanonicalTitle(Router.current().params.name).fetch().first();
	$('#tokenfield').tokenfield({
	    tokens: obj.tags
	});
        Session.set('productsAddedToArtwork',obj.products);
    } else {
	$('#tokenfield').tokenfield();
        Session.set('productsAddedToArtwork',obj);
    };
    if (obj) {
	Meteor.subscribe('Images',obj.image);
    } else {
	Meteor.subscribe('Images');
    };
    //product manager
    Meteor.subscribe('getAllCategories');
    Meteor.subscribe('getAllProducts');
    Meteor.subscribe('getAllMockups');
};
