Meteor.publish(null, function () {
    if (!Roles.userIsInRole(this.userId,'admin')) {
	return Meteor.users.find({_id:this.userId},{fields:{roles:1, services:1, emails:1, profile:1, username:1, followers:1, lat:1, lng:1, formatted_address:1}});
    };
});

Meteor.publish('userByUsername', function (username) {
    var idArray=[];
    var res;
    //show users with current username
    var current=Meteor.users.findOne({username:username});
    if (current) {
	idArray.push(current._id);
    
	//following this user - in his followers field
	idArray=idArray.concat(current.followers);

	//followed by this user - this user id in their followers field
	Meteor.users.find({followers:current._id}).forEach(function (el){
	    var compare=function (id, arr) {
		for (var i=0;i<arr.length; i++) {
		    if (id === arr[i])
			return true;
		};
		return false;
	    };
	    if (!compare(el._id,idArray))
		idArray.push(el._id);
	});
    
	//clean profile so there where no restricted information
	res = Meteor.users.find({_id:{$in: idArray}},{fields:{username:1, followers:1,
							      'services.twitter.profile_image_url':1,
							      'services.facebook.id':1,
							      'services.google.picture':1,
							      'profile.firstName':1,
							      'profile.lastName':1,
							      'profile.bio':1,
							      'profile.gender':1,
							      formatted_address:1,
							      lat:1,
							      lng:1}});
    };
    if (res)
	return res;
    return false;
});

Meteor.publish('userById', function (id) {
    var idArray=[];
    var res;
    //show users with current username
    var current=Meteor.users.findOne({_id:id});
    if (current) {
	idArray.push(current._id);
    
	//clean profile so there where no restricted information
	res = Meteor.users.find({_id:{$in: idArray}},{fields:{username:1, followers:1,
							      'services.twitter.profile_image_url':1,
							      'services.facebook.id':1,
							      'services.google.picture':1,
							      'profile.firstName':1,
							      'profile.lastName':1,
							      'profile.bio':1,
							      'profile.gender':1,
							      formatted_address:1,
							      lat:1,
							      lng:1}});
    };
    if (res)
	return res;
    return false;
});


