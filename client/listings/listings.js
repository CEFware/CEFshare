var getUserId=function () {
    var uri=Router.current().params.username;
    if (uri) {
	var obj=Meteor.users.findOne({username:uri});
	if (obj)
	    return obj._id;
    };
    return false;
};

Template.allListings.helpers({
    listings: function () {
	switch (Router.current().lookupTemplate()) {
	case "UserProfile":
	    if (Meteor.user() && (Meteor.userId()===getUserId())) {
		return allListingsByAuthor(Meteor.userId());
	    } else {
		if (getUserId()) 
		    return publicListingsByAuthor(getUserId());
		return null;
	    };
	    break;
	default:
	    return allListingsOnHomepage();
	};
    },
    listingImg: function (){
        var listing = this;
        if (listing) {
            var imgs=Images.findOne({_id:listing.image});
            if (imgs)
                return imgs.url();
        };
    },
    listingIsPublic: function () {
	return this.isPublic; 
    }
});

Template.allListings.rendered= function (){
    Tracker.autorun(function(){
	//subscribe only to those listings we may show
	//on listings - for homepage - over router by default
	if (Router.current().lookupTemplate()==="UserProfile") {
	    if (Meteor.user() && (Meteor.userId()===getUserId())) {
		//on profile for owner - all by author 
		Meteor.subscribe('getListingsByAuthor',Meteor.userId());
	    } else {
		//on profile for visitor - only public by author 
		if (getUserId())
 		    Meteor.subscribe('getPublicListingsByAuthor',getUserId());
	    };
	} else {
 	    Meteor.subscribe('allListingsOnHomepage');
	};
	//add id's to get only needed images - by adding an array with needed images id's
	var imgA=[];
	allListings().forEach(function(el){
            imgA.push(el.image);
	});
	Meteor.subscribe('images',imgA);
    });
};
