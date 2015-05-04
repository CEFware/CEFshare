Meteor.publish('categories', function(){
    if (Roles.userIsInRole(this.userId,'admin')) {
	return Categories.find();
    };
    return Categories.find({},{fields:{name:1,parent:1,listings:1}});
});
