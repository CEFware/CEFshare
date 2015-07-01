/**
 * Created by piyushthapa on 6/25/15.
 */
Template.userProfile.helpers({
    autherId:function(){
        return Meteor.userId();
    },
    curUsername: function () {
	return Router.current().params.username;
    },
    img: function () {
	var res=Meteor.users.findOne({username:Router.current().params.username});
	if (res && res.profile && res.profile.avatar)
	    return Avatars.findOne({_id:res.profile.avatar}).url();
    }
});
