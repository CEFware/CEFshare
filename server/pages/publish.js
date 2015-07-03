Meteor.publish('pages', function(uri){
    if (uri)
	return Pages.find({uri:uri});
    if (Roles.userIsInRole(this.userId,'admin'))
	return Pages.find();
    return Pages.find({},{fields:{uri:1,url:1,title:1,active:1}});
});
