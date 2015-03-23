Template.userProfile.helpers({
    user: function () {
	var res = Meteor.users.findOne({username:Router.current().params.username});
	if (res)
	    return res;
    },

    notEmpty : function (obj) {
	if (obj) 
	    return true;
	return false;
    },

    oauthService: function() {
	return AccountsTemplates.oauthServices();
    },

    contactUser: function (){
	var ses=Session.get('contactUser');
	if (ses)
	    return ses;
	return false;
    },

    editingProfile: function (){
	if (Meteor.user()) {
            if (Router.current().lookupTemplate()==="UserProfileEdit") {
                Session.set('editingProfile',true);
                return true;
            };
 	    var ses=Session.get('editingProfile');
	    if (ses)
		return ses;
	};
	return false;
    },

    following: function () {
	var u=Meteor.users.findOne({username:Router.current().params.username,followers:Meteor.user()._id}); 
	if (u)
	    return true;
	return false;
    },

    contactFormSchema: function() {
	return Schema.contact;
    },

    userProfileEmail: function () {
	var res=Session.get('emailByUsername');
	if (res)
	    return res;
    },

    followersList: function () {
	return Meteor.users.findOne({username:Router.current().params.username}).followers;
    },

    followingList: function () {
	return Meteor.users.find({followers:Meteor.users.findOne({username:Router.current().params.username})._id}).fetch();
    }

});


AutoForm.addHooks(['contactForm'],{
    onSuccess: function (){
        Flash.success('contactForm',"Thank you!",2000);
	Session.set('contactUser',null);
	Session.set('emailByUsername',null);
    }
});


Template.userProfile.events({
    'click .followUser': function (event, template) {
	Meteor.call('followUser',Router.current().params.username, function (e,f){
	    if ((!e) && Roles.userIsInRole(Meteor.user()._id,['verified']))
		Meteor.call('newFollowerEmail',Router.current().params.username);
	}); 
    },
    'click .unFollowUser': function (event, template) {
	Meteor.call('unFollowUser',Router.current().params.username); 
    },

    'click .contactUser': function () {
	Meteor.call('emailByUsername',Router.current().params.username, function (e,r){
	    if ((!e) && r) {
		Session.set('emailByUsername',r);
		Session.set('contactUser',true);
	    };
	});
    },

    'click .cancelContact':function () {
	Session.set('contactUser',null);
    }, 

    'click .editProfile': function () {
	Session.set('editingProfile',true);
     },

    'click .cancelEditProfile':function (e) {
	e.preventDefault();
	Session.set('editingProfile',null);
        if (Router.current().lookupTemplate()==="UserProfileEdit")
	    Router.go('userProfile',{username:Router.current().params.username});
    }
});

Template.registerHelper('isOwner', function () {
    if (Meteor.user() && (Router.current().params.username === Meteor.user().username))
	return true;
    return false;
});

Template.registerHelper('usernameById', function (id) {
    var res=Meteor.users.findOne({_id:id});
    if (res)
	return res.username;
    return null;
});

Template.locationMap.helpers({
    exampleMapOptions: function() {
        // Make sure the maps API has loaded
	var lat=25.7738889;
	var lng=-80.1938889;
	//get here current user location LatLng
	if (Meteor.user() && Meteor.user().formatted_address && Meteor.user().lat && Meteor.user().lng){
	    lat=Meteor.user().lat;
	    lng=Meteor.user().lng;
	};
        if (GoogleMaps.loaded()) {
	    // Map initialization options
	    return {
                center: new google.maps.LatLng(lat, lng),
                zoom: 10
	    };
        };
    }
});


