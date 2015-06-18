function buildRegExp(searchText) {
    // this is a dumb implementation
    var parts = searchText.trim().split(/[ \:]+/);
    return new RegExp("(" + parts.join('|') + ")", "ig");
};

specificListing = function (id) {
  return Listings.find({
    _id: id
  });
}

specificListingByURI = function (uri) {
    return Listings.find({
	uri: uri
    });
}

allListingsOnHomepage = function (homeSearch,filters) {
    var query={};
    query.isPublic=true;
    if (homeSearch)
	query.title=buildRegExp(homeSearch);
    if (filters) {
	var idArr=[];
	//get category listing _id's
	if (filters.category) {
	    var resC=Categories.findOne({name:filters.category,parent:{$exists:false}});
	    if (resC && resC.listings)
		idArr=resC.listings;
	    //get subcategory listing _id's
	    if (filters.subcategory) {
		var resS=Categories.findOne({name:filters.subcategory,parent:filters.category});
		if (resS && resS.listings)
		    idArr=resS.listings;
	    };
	    query._id={$in:idArr};
	};
	_.map(filters, function (val,k) {
	    if ((k!=='category') && (k!=='subcategory')) {
		if (val.lower || val.upper) {
		    query[k]={$gte:val.lower, $lte:val.upper};
		} else if (typeof(val)==='boolean') {
		    query[k]=val;
		} else {
		    query[k]={$in:val};
		};
	    };
	});
    };
    return Listings.find(query,{limit: 12});
}

allListingsActive = function () {
  return Listings.find({
    active: true
  });
}

allListingsBy_IdArray = function (_idArray) {
  return Listings.find({
      _id:{$in:_idArray},
      isPublic: true
  });
}

allListingsByAuthor = function (authorId) {
  return Listings.find({
      author:authorId
  });
}

allListingsByTags = function (tags,exceptId,limit) {
    var query={};
    query.tags={$in:tags};
    if (exceptId)
	query._id={$ne:exceptId};
    if (!limit)
	limit=0;
    return Listings.find(query, {limit:limit});
}

publicListingsByAuthor = function (authorId, exceptId, limit) {
    var query={};
    query.author=authorId;
    query.isPublic=true;
    if (exceptId)
	query._id={$ne:exceptId};
    if (!limit)
	limit=0;
    return Listings.find(query, {limit:limit});
}

allListingsByURI = function (uriArr, exceptId, limit) {
    var query={};
    query.uri={$in:uriArr};
    if (exceptId)
	query._id={$ne:exceptId};
    if (!limit)
	limit=0;
    return Listings.find(query, {limit:limit});
}

allListings = function () {
  return Listings.find();
}

unavailableDates = function (lUri) {
    var author=Listings.findOne({uri:lUri})
    if (author && author.author) {
	author=author.author;
	//parse all orders of this author with day items
	var cur=Orders.find({'items.product.itemName':'day','items.product.author':author}).fetch();
	var res=[];
	//get all uniq sold dates in array
	cur.forEach(function (el) {
	    res=_.union(res,el.items[0].clientData.datePick.split(','));
	});
	//add it to the colletion
	var dates=UnavailableDates.findOne();
	if (dates && dates._id) {
	    UnavailableDates.update({_id:dates._id},{$set:{dates:res}})
	} else {
	    UnavailableDates.insert({dates:res});
	};
	//return that collection
	return UnavailableDates.find();
    } else {
	UnavailableDates.insert({dates:[]});
	return UnavailableDates.find();
    };
}
