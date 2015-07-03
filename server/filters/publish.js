Meteor.publish('filtersData',function () {
    var res=Main.findOne();
    if (res && res.filters) {
	var queryG={};
        res.filters.forEach(function (el){
            if (el.active && Listing._schema[el.fieldName]) {
                var type=Listing._schema[el.fieldName].type.name;
                switch (type) {
                case 'String':
		    //get variants for this filter field 
		    var query={};
		    query[el.fieldName]={$exists:true};
		    var tA=_.uniq(_.map(Listings.find(query).fetch(),function (el2) {return el2[el.fieldName]}));
		    queryG[el.fieldName]=tA.map(function (val){return {label: val, value: val}});
                    break;
                case 'Number':
		    //get range for this filter field
		    var query={};
		    query[el.fieldName]={$exists:true};
		    var max=Math.max.apply(null,_.map(Listings.find(query).fetch(),function (el2) {return el2[el.fieldName]}));
		    var min=Math.min.apply(null,_.map(Listings.find(query).fetch(),function (el2) {return el2[el.fieldName]}));
		    if ((max == Number.POSITIVE_INFINITY) || (max == Number.NEGATIVE_INFINITY)) max=100;
		    if ((min == Number.POSITIVE_INFINITY) || (min == Number.NEGATIVE_INFINITY)) min=0;
		    if (min === max) min=0;
		    queryG[el.fieldName]={min:min,max:max};
                    break;
                default:
                    break;
                };
            };
        });
	FiltersData.update({},queryG,{upsert:true});
    };
    return FiltersData.find();
});
