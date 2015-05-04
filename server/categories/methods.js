Meteor.methods({
    setListingCategory: function (lId,cat) {
	//allowed to owner & admin
	var l=Listings.findOne({_id:lId});
	if ((l.author===Meteor.userId()) || (Roles.userIsInRole(Meteor.userId(),'admin'))) {
            //remove listing from current category
console.log(lId);
console.log(l);
console.log(cat);
            //add listing to new category
	};
    }
});
