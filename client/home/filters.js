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
//test select-radio-inline && boolean-radios
//	    type: "select-radio",
//	defaultValue: true,
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
	if (res)
	    return res;
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
	var ses={};
	($('.nouislider')).map(function (el,v){ 
	    var name=$(v).parent().attr('name');
	    var res = FiltersData.findOne()[name];
	    ses[name]={lower:res.min,upper:res.max};
	});
	Session.set('filters',ses);
	setTimeout(function () {
	    ($('.nouislider')).map(function (el,v){ 
		var name=$(v).parent().attr('name');
		$('[name='+name+'] .nouislider').Link('lower').to($('#lower'+name));
		$('[name='+name+'] .nouislider').Link('upper').to($('#upper'+name));
	    });
	}, 300);
    }
});

Template.filters.rendered = function() {
    Meteor.subscribe('categories');
    Tracker.autorun(function () {
	var curFilters=Session.get('filters');
	setTimeout(function () {
	    ($('.nouislider')).map(function (el,v){ 
		var name=$(v).parent().attr('name');
		if (curFilters && curFilters[name]) {
		    var newr=[];
		    newr.push(curFilters[name].lower);
		    newr.push(curFilters[name].upper);
		    $('[name='+name+'] .nouislider').val(newr);
		};
		$('[name='+name+'] .nouislider').Link('lower').to($('#lower'+name));
		$('[name='+name+'] .nouislider').Link('upper').to($('#upper'+name));
	    });
	}, 300);
    });
};

AutoForm.addHooks(['homeFilters'],{
    onSuccess: function (){
        window.scrollTo(0,0);

	var curFilters=Session.get('filters');
	($('.nouislider')).map(function (el,v){ 
	    var name=$(v).parent().attr('name');
	    if (curFilters && curFilters[name]) {
		var newr=[];
		newr.push(curFilters[name].lower);
		newr.push(curFilters[name].upper);
		$('[name='+name+'] .nouislider').val(newr);
	    };
	    $('[name='+name+'] .nouislider').Link('lower').to($('#lower'+name));
	    $('[name='+name+'] .nouislider').Link('upper').to($('#upper'+name));
	})

    }
});

