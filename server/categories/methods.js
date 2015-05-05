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
