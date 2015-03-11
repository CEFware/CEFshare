Meteor.methods({

    createNewListing: function (doc) {
	var convertToSlug = function(Text) {
	    return Text
		.toLowerCase()
		.replace(/[^\w ]+/g,'')
		.replace(/ +/g,'-')
            ;
	};

	doc.author=Meteor.userId();
	doc.createdAt=new Date;

	check(doc, Listing);

	doc.uri=convertToSlug(doc.title);
	var c=1;
	while (specificListingByURI(doc.uri).fetch().length>0) {
	    doc.uri=convertToSlug(doc.title)+c;
	    c++;
	};

	Listings.insert(doc);
	
	return doc.uri;
    } 

});
