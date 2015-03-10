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

allListingsByTags = function (tags) {
  return Listings.find({
      tags:{$in:tags}
  });
}

publicListingsByAuthor = function (authorId) {
  return Listings.find({
      author:authorId,
      isPublic: true
  });
}

allListings = function () {
  return Listings.find();
}
