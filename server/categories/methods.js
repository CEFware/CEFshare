Meteor.methods({
    setListingCategory: function (lId,cat) {
	if (cat && (cat.length>0)) {
	    //allowed to owner & admin
	    var l=Listings.findOne({_id:lId});
	    if ((l.author===Meteor.userId()) || (Roles.userIsInRole(Meteor.userId(),'admin'))) {
		//remove listing from current categories
		Categories.update({listings:lId},{$pull:{listings:lId}},{multi:true});
		//add listing to new category
		Categories.update({name:cat[0],parent:{$exists:false}},{$push:{listings:lId}});
		if (cat[1])
		    Categories.update({name:cat[1],parent:cat[0]},{$push:{listings:lId}});
	    };
	};
    },
    deleteCategory: function (id) {
	if (Roles.userIsInRole(Meteor.userId(),'admin')) {
	    Categories.remove({_id:id});
	};
    },
    updateCategory: function (id, newName) {
	if (Roles.userIsInRole(Meteor.userId(),'admin')) {
	    var res=Categories.findOne({_id:id,parent:{$exists:false}});
	    if (res)
		//if parent - change all children categories parent field
		Categories.update({parent:res.name},{$set:{parent:newName}},{multi:true});
	    Categories.update({_id:id},{$set:{name:newName}});
	};
    }
});
