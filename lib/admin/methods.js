Meteor.methods({
    homeFilters: function (doc) {
	if (Meteor.isClient) {
	    var res=Session.get('filters',doc);
	    if (res)
		Session.set('filters',res.filters=doc);
	    Session.set('filters',{filters:doc});
	};
    }
});
