var RangeSchema = new SimpleSchema({
    lower: {
	type: Number
    },
    upper: {
	type: Number
    }
});

var baseFilters = new SimpleSchema ({
    range: {
	type: RangeSchema,
	max: 100,
	min: 0,
	optional: true,
	autoform: {
	    type: "noUiSlider"
	}
    },
    bool: {
	type: [String],
	optional: true,
	autoform: {
	    options: [{label:'YES',value:true}, {label:'NO',value:false}]
	}
    },
    options: {
	type: [String],
	optional: true,
	autoform: {
	    options: [{label:'first',value:'f'}, {label:'2nd',value:'2'}]
	}
    }
});

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
    showFilters: function () {
	if (Main.findOne({'filters.active':true}))
	    return true;
	return false;
    },
    homeFiltersSchemaObj: function () {
	//build custom SimpleSchema for the filters form our of base schema
	var res=Main.findOne();
	var schema=[];
	if (res && res.filters) {
	    res.filters.forEach(function (el){
		if (el.active) {
		    var type=Listing._schema[el.fieldName].type.name;
		    switch (type) {
		    case 'String':
			var nObj = {};
			nObj[el.fieldName]=baseFilters._schema.options;
			nObj[el.fieldName+'.$']=baseFilters._schema['options.$'];
			schema.push(nObj);
 			break;
		    case 'Number':
			var nObj = {};
			nObj[el.fieldName]=baseFilters._schema.range;
			schema.push(nObj);
			break;
		    case 'Boolean':
			var nObj = {};
			nObj[el.fieldName]=baseFilters._schema.bool;
			nObj[el.fieldName+'.$']=baseFilters._schema['bool.$'];
			schema.push(nObj);
			break;
		    default:
			break;
		    };
		};
	    });
	    var finSchema=new SimpleSchema(schema);
	    var objL={};
	    res.filters.forEach(function (el){
		objL[el.fieldName]=el.title;
	    });
	    finSchema.labels(objL);
	};
	return finSchema;
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
