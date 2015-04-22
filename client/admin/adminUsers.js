Template.adminUsers.helpers({
    listUsers: function () {
	return Meteor.users.find();
    }, 
    registeredDate: function () {
	if (this.createdAt) {
            var res=new Date(this.createdAt);
            return res.toISOString().slice(0,10);
	};
    },
    hasAdminRole: function () {
	if (this._id) {
	    return Roles.userIsInRole(this._id,'admin');
	};
    }
});

Template.adminUsers.rendered = function () {
    Tracker.autorun(function(){
	Meteor.subscribe('adminUsersList');
    });
};
