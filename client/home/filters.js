Template.filters.helpers({
    parentCategories: function () {
	return Categories.find({parent:{$exists:false}});
    },
    childrenCategories: function () {
	return Categories.find({parent:this.name});
    },
    currentSelected: function (name) {
	var cur = Session.get('filters');
	if (cur && cur.category) {
	    if (cur.category===name)
		return true;
	} else if (name==='noCategory') {
	    return true;
	};
	return false;
    },
    currentSubSelected: function (name) {
	var cur = Session.get('filters');
	if (cur && cur.category && cur.subcategory) {
	    if (cur.subcategory===name)
		return true;
	};
	return false;
    }
});

Template.filters.events({
    'click .noCategory': function (e,t) {
	e.preventDefault();
	var cur=Session.get('filters');
	if (cur) {
	    cur.category=null;
	} else {
	    cur={category:null}
	};
	Session.set('filters',cur);
    },
    'click .categoryName': function (e,t) {
	e.preventDefault();
	var cur=Session.get('filters');
	if (cur) {
	    cur.category=$(e.currentTarget).text();
	    cur.subcategory=null;
	} else {
	    cur={category:$(e.currentTarget).text(), subcategory:null};
	};
	Session.set('filters',cur);
    },
    'click .subcategoryName': function (e,t) {
	e.preventDefault();
	var cur=Session.get('filters');
	if (cur) {
	    cur.subcategory=$(e.currentTarget).text();
	} else {
	    cur={subcategory:$(e.currentTarget).text()};
	};
	Session.set('filters',cur);
    }
});

Template.filters.rendered = function() {
    Meteor.subscribe('categories');
};
