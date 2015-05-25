Meteor.publish('filtersData',function () {
    var res=Main.findOne();
    if (res && res.filters) {
	var queryG={};
        res.filters.forEach(function (el){
            if (el.active) {
                var type=Listing._schema[el.fieldName].type.name;

                switch (type) {
                case 'String':
		    //get variants for this filter field 
		    var query={};
		    query[el.fieldName]={$exists:true};
		    queryG[el.fieldName]=_.uniq(_.map(Listings.find(query).fetch(),function (el2) {return el2[el.fieldName]}));
                    break;
                case 'Number':
		    //get range for this filter field
		    var query={};
		    query[el.fieldName]={$exists:true};
		    var max=Math.max.apply(null,_.map(Listings.find(query).fetch(),function (el2) {return el2[el.fieldName]}));
		    var min=Math.min.apply(null,_.map(Listings.find(query).fetch(),function (el2) {return el2[el.fieldName]}));
		    queryG[el.fieldName]={max:max,min:min};
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
