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

allListingsOnHomepage = function (homeSearch) {
    var query={};
    query.isPublic=true;
    if (homeSearch)
	query.title=buildRegExp(homeSearch);
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
