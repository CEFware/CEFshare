Template.storefront.helpers({
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

    contactUser: function (){
	var ses=Session.get('contactUser');
	if (ses)
	    return ses;
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
    }
});


AutoForm.addHooks(['contactForm'],{
    onSuccess: function (){
        Flash.success('contactForm',"Thank you!",2000);
	Session.set('contactUser',null);
	Session.set('emailByUsername',null);
    }
});


Template.storefront.events({
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
    }
});
