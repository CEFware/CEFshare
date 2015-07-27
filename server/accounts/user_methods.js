Meteor.methods({
    editUserProfile: function (doc) {
	if (Meteor.userId()) {
	    check(doc, User.User)

	    var querySet={};
	    var queryUnset={};
	    var keys=['profile','formatted_address','lat','lng'];
	    keys.forEach(function (val) {
		if (doc[val]) {
		    querySet[val]=doc[val]
		} else {
		    queryUnset[val]="";
		};
	    });

	    if (Meteor.user().emails[0].address===doc.emails[0].address) {

		if (Object.keys(querySet).length>0)
		    Meteor.users.update(Meteor.userId(), {
			$set: querySet
		    });

		if (Object.keys(queryUnset).length>0)
		    Meteor.users.update(Meteor.userId(), {
			$unset: queryUnset
		    });

	    } else if (!Meteor.users.find({"emails.0.address":doc.emails[0].address}).fetch().length>0) {
		
		if (Roles.userIsInRole(Meteor.user()._id, 'verified')) 
		    Roles.removeUsersFromRoles(Meteor.user()._id,['verified'],Roles.GLOBAL_GROUP);

		Roles.addUsersToRoles(Meteor.user()._id,['unverified'],Roles.GLOBAL_GROUP);

		querySet['emails']=[{address:doc.emails[0].address,verified:false}];
 		
		if (Object.keys(querySet).length>0)
		    Meteor.users.update(Meteor.userId(), {
			$set: querySet
		    });

		if (Object.keys(queryUnset).length>0)
		    Meteor.users.update(Meteor.userId(), {
			$unset: queryUnset
		    });

		Meteor.call('sendVerEmail');

	    } else {
		throw new Meteor.Error(403,"Another user has this e-mail"); 
	    };
	
	} else {
	    throw new Meteor.Error("security-check-fail", "You must be a user to edit profile.");
	};
    },
    
    followUser: function (username){
	if (Meteor.user()) {
	    return Meteor.users.update({username:username},{$addToSet:{followers:this.userId}});
	} else {
	    throw new Meteor.Error("security-check-fail", "You must be a user to follow another user");
	};
    },

    unFollowUser: function (username){
	if (Meteor.user()) {
	    return Meteor.users.update({username:username},{$pull:{followers:this.userId}});
	} else {
	    throw new Meteor.Error("security-check-fail", "You must be a user to unfollow another user");
	};
    },

    emailByUsername: function (username) {
	if (Meteor.user()) {
            var u=Meteor.users.findOne({username:username});
            if (u)
		return currentUserEmail(u);
            return null;
	} else {
	    throw new Meteor.Error("security-check-fail", "You must be a user to contact another user");
	};
    },

    ban: function (userObj) {
	this.unblock();
	if (Roles.userIsInRole(Meteor.userId(),'admin') && (userObj._id!==Meteor.userId())) {
            if (Roles.userIsInRole(userObj,'banned')) {
		Roles.removeUsersFromRoles(userObj,'banned',Roles.GLOBAL_GROUP);
            } else {
		Roles.addUsersToRoles(userObj,'banned',Roles.GLOBAL_GROUP);
            };
	};
    },

    makeAdmin: function (userObj) {
	this.unblock();
	if (Roles.userIsInRole(Meteor.userId(),'admin') && (userObj._id!==Meteor.userId())) {
            if (Roles.userIsInRole(userObj,'admin')) {
		Roles.removeUsersFromRoles(userObj,'admin',Roles.GLOBAL_GROUP);
            } else {
		Roles.addUsersToRoles(userObj,'admin',Roles.GLOBAL_GROUP);
            };
	};
    }
});
