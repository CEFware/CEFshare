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
	type: Boolean,
	optional: true,
	autoform: {
	    options: [{label:'YES',value:true}, {label:'NO',value:false}]
	}
    },
    options: {
	type: [String],
	optional: true,
	autoform: { 
	    options : function () {
		return FiltersData.findOne()[this.name];
	    } 
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
			nObj[el.fieldName+'.lower']=baseFilters._schema['range.lower'];
			nObj[el.fieldName+'.upper']=baseFilters._schema['range.upper'];
			schema.push(nObj);
			break;
		    case 'Boolean':
			var nObj = {};
			nObj[el.fieldName]=baseFilters._schema.bool;
			schema.push(nObj);
			break;
		    default:
			break;
		    };
		};
	    });
	    finSchema=new SimpleSchema(schema);
	    var objL={};
	    res.filters.forEach(function (el){
		objL[el.fieldName]=eval("tmp=function () {return TAPi18n.__('"+el.title+"')}");
	    });
	    finSchema.labels(objL);
	};
	return finSchema;
    },
    homeFiltersNow: function () {
	//return current stage of the filters
	var res= Session.get('filters');
	if (res && res.filters)
	    return res.filters;
    },
    customRange: function () {
	if (Listing._schema[this.name].type.name==='Number') {
	    var res = FiltersData.findOne()[this.name];
	    return '{"min":'+res.min+',"max":'+res.max+'}';
	};
	return null;
    },
    startRange: function () {
	if (Listing._schema[this.name].type.name==='Number') {
	    var res = FiltersData.findOne()[this.name];
	    return '['+res.min+','+res.max+']';
	};
	return null;
    },
    getLabel: function () { 
	return finSchema._schema[this.name].label();
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
    },
    'click .reset': function (e,t) {
	Session.set('filters',null);
    }
});

Template.filters.rendered = function() {
    Meteor.subscribe('categories');
    Tracker.autorun(function () {
	var k=Session.get('filters');
	if (k) k=k.filters;
	var res=Main.findOne();
	if (res && res.filters) {
	    res.filters.forEach(function (el){
		if (el.active && (Listing._schema[el.fieldName].type.name==='Number')) {
		    if (k && k[el.fieldName]) {
			var newr=[];
			newr.push(k[el.fieldName].lower);
			newr.push(k[el.fieldName].upper);
			$('[name='+el.fieldName+'] .nouislider').val(newr);
		    };
		    $('[name='+el.fieldName+'] .nouislider').Link('lower').to($('#lower'+el.fieldName));
		    $('[name='+el.fieldName+'] .nouislider').Link('upper').to($('#upper'+el.fieldName));
		};
	    });
	};
    });
};

AutoForm.addHooks(['homeFilters'],{
    onSuccess: function (){
        window.scrollTo(0,0);
    }
});

