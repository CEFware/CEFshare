Accounts.config({sendVerificationEmail: true});

AccountsMeld.configure({
    askBeforeMeld: true
});

Accounts.onCreateUser(function(options, user) {
    var accessToken, result, screenName;
    var username;
    //add profile creation and avatar to other social network logins
    if (user.services.facebook || user.services.google || user.services.twitter) {
	user.profile = options.profile;
	user.followers=[];
        user.profile.bio = "";
        user.profile.gender = "";
	user.formatted_address = "";
	user.lat = "";
	user.lng = "";
        user.profile.firstName = "";
        user.profile.lastName = "";

        if (user.services.facebook) {
            accessToken = user.services.facebook.accessToken;
            result = Meteor.http.get('https://graph.facebook.com/me', {
                params: {
                    access_token: accessToken
                }
            });

            if (result.error)
                throw result.error;

	    if (result.data.hometown) {
		result2 = Meteor.http.get('https://graph.facebook.com/'+result.data.hometown.id);

		if (result2.error)
                    throw result2.error;

		user.formatted_address = result.data.hometown.name;
		user.lat = result2.data.location.latitude;
		user.lng = result2.data.location.longitude;
	    };

            if (result.data.bio)
		user.profile.bio = result.data.bio;

            user.profile.gender = result.data.gender;
            user.profile.firstName = result.data.first_name;
            user.profile.lastName = result.data.last_name;
	    user.emails=[{address:user.services.facebook.email,verified:result.data.verified}];
        };

	if (user.services.google) {

            user.profile.gender = user.services.google.gender;
            user.profile.firstName = user.services.google.given_name;
            user.profile.lastName = user.services.google.family_name;
	    
	    user.emails=[{address:user.services.google.email,verified:user.services.google.verified_email}];
	};

	if (user.services.twitter) {
	    username=user.services.twitter.screenName;
	    user.emails=[{address:"",verified:false}];
	    user.roles = {__global_roles__:['unverified']};
	}; 

	if (!user.roles)
	    user.roles = {__global_roles__:['verified']};

    } else {
	if (options.profile) {
	    user.profile = options.profile;
	} else {
	    user.profile={};
	};
	user.roles = {__global_roles__:['unverified']};
	user.followers=[];
    };

    //make uniq username
    //check how this works for twitter
    if ((!username) && user.emails) {
	username=user.emails[0].address;
    } else if (user.profile && user.profile.email) {
	username=user.profile.email;
    } else if (user.services && user.services.facebook && user.services.facebook.email) {
        username=user.services.facebook.email;
    } else if (user.services && user.services.google && user.services.google.email) {
        username=user.services.google.email;
    };

    if (username.indexOf('@')>0)
	username=username.substring(0,username.indexOf('@'));
    var c=1;
    while (Meteor.users.findOne({username:username})) {
	username=username+c;
	c++;
    }; 

    user.username=username;

    return user;

});

Accounts.onLogin(function(options) {
    //change role to "verified" if e-mail is verified
    if (options.user.emails && options.user.emails[0].verified) {
	Roles.addUsersToRoles(options.user._id,['verified'], Roles.GLOBAL_GROUP);
	Roles.removeUsersFromRoles(options.user._id,['unverified'], Roles.GLOBAL_GROUP);
    } else {
	if (!Roles.userIsInRole(options.user, 'verified')) Roles.addUsersToRoles(options.user._id,['unverified'], Roles.GLOBAL_GROUP);
    };
});

