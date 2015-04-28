Meteor.publish('appSettings', function(){
    if (Roles.userIsInRole(this.userId,'admin')) {
	return Main.find();
    };
    return Main.find({},{fields:{publicData:1}});
});

Meteor.publish('categories', function(){
    if (Roles.userIsInRole(this.userId,'admin')) {
	return Categories.find();
    };
    return Categories.find({},{fields:{name:1,parent:1}});
});
