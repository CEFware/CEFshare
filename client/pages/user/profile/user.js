/**
 * Created by piyushthapa on 6/25/15.
 */
Template.userProfile.helpers({
    autherId:function(){
         return Meteor.userId();
     },
    curUsername: function () {
	return Router.current().params.username;
    }
});
