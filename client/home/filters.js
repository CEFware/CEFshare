Template.filters.helpers({
    parentCategories: function () {
	return Categories.find({parent:{$exists:false}},{sort:{name:1}});
    },
    childrenCategories: function () {
	return Categories.find({parent:this.name},{sort:{name:1}});
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
    },
    search: function () {
	return Session.get('homeSearch');
    },
    homeFiltersSchemaObj: function () {
	//build custom SimpleSchema for the filters form our of base schema
	return new SimpleSchema({});
    },
    homeFiltersNow: function () {
	//return current stage of the filters
    }
});

Template.filters.events({
    'click .noCategory': function (e,t) {
	e.preventDefault();
	var cur=Session.get('filters');
	if (cur) {
	    cur.category=null;
	    cur.subcategory=null;
	} else {
	    cur={category:null,subcategory:null}
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
    },
    'click .cancelSearch': function (e,t) {
	e.preventDefault();
	$('#search-box').val("");
	Session.set('homeSearch',null);
    }




});

Template.filters.rendered = function() {
    Meteor.subscribe('categories');
};
