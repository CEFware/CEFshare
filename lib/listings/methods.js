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
		idArr.push(resC.listings);
	    //get subcategory listing _id's
	    if (filters.subcategory) {
		var resS=Categories.findOne({name:filters.subcategory,parent:filters.category});
		if (resS && resS.listings)
		    idArr.push(resS.listings);
	    };
	    idArr=_.uniq(idArr);
	    query._id={$in:idArr};
	};
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
