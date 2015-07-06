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
    followingList: function () {
        return Meteor.users.find({followers:Meteor.users.findOne({username:Router.current().params.username})._id}).fetch();
    },
    followersList: function () {
        return Meteor.users.findOne({username:Router.current().params.username}).followers;
    },
    following: function () {
        var u=Meteor.users.findOne({username:Router.current().params.username,followers:Meteor.user()._id});
        if (u)
            return true;
        return false;
    }
});
