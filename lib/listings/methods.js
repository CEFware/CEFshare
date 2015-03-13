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

allListingsOnHomepage = function () {
  return Listings.find({
    isPublic: true
  },{limit: 12});
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

allListings = function () {
  return Listings.find();
}
