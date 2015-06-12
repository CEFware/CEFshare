Template.adminUsers.helpers({
    listUsers: function () {
	res=Session.get('joined');
	if (!res)
	    res=1;
	return Meteor.users.find({},{sort:{createdAt:res}});
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
    },
    isBanned: function () {
	if (this._id) {
	    return Roles.userIsInRole(this._id,'banned');
	};
    }
});

Template.adminUsers.rendered = function () {
    Tracker.autorun(function(){
	Meteor.subscribe('adminUsersList');
    });
};

Template.adminUsers.events({
    'click .ban': function (e) {
	e.preventDefault();
	Meteor.call('ban',this);
    },

    'click .makeAdmin':  function (e) {
	e.preventDefault();
	Meteor.call('makeAdmin',this);
    },
    'click .fa-sort': function (e) {
	e.preventDefault();
	res=Session.get('joined');
	if (!res)
	    res=-1;
	res=res*-1;
	Session.set('joined',res);
    }

});
