Meteor.methods({
    editUserProfile: function (doc) {
	check(doc, User.User)

	if (Meteor.user().emails[0].address===doc.emails[0].address) {
	    Meteor.users.update(Meteor.userId(), {
		$set: {
		    profile: doc.profile,
		    formatted_address: doc.formatted_address,
		    lat:doc.lat,
		    lng:doc.lng
		}
	    });

	} else if (!Meteor.users.find({"emails.0.address":doc.emails[0].address}).fetch().length>0) {
 
            if (Roles.userIsInRole(Meteor.user()._id, 'verified')) 
		Roles.removeUsersFromRoles(Meteor.user()._id,['verified'],Roles.GLOBAL_GROUP);
            Roles.addUsersToRoles(Meteor.user()._id,['unverified'],Roles.GLOBAL_GROUP);
 	    
	    Meteor.users.update(Meteor.userId(), {
		$set: {
		    profile: doc.profile,
		    emails : [{address:doc.emails[0].address,verified:false}],
		    formatted_address: doc.formatted_address,
		    lat:doc.lat,
		    lng:doc.lng
		}
	    });

	    Meteor.call('sendVerEmail');

	} else {
	    throw new Meteor.Error(403,"Another user has this e-mail"); 
	};
	
    },
    
    followUser: function (username){
	return Meteor.users.update({username:username},{$addToSet:{followers:this.userId}});
    },

    unFollowUser: function (username){
	return Meteor.users.update({username:username},{$pull:{followers:this.userId}});
    },

    emailByUsername: function (username) {
        var u=Meteor.users.findOne({username:username});
        if (u)
            return currentUserEmail(u);
        return null;
    }
});
