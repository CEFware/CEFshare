Meteor.methods({
    homeFilters: function (doc) {
	if (Meteor.isClient) {
	    var res=Session.get('filters',doc);
	    if (res) {
		var newRes=doc;
		if (res.category) 
		    newRes.categorey=res.category;
		if (res.subcategory) 
		    newRes.subcategorey=res.subcategory;
		Session.set('filters',newRes);
	    }
	    Session.set('filters',doc);
	};
    }
});
