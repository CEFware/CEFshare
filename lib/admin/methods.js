Meteor.methods({
    homeFilters: function (doc) {
	if (Meteor.isClient) {
	    Session.set('filters',doc);
	};
    }
});