Template.admin.helpers({
    email: function() {
	if (Roles.userIsInRole(Meteor.userId(),'verified'))
	    return 'success';
	return 'danger';
    },
    stripe: function() {
	if (Main.findOne() && Main.findOne().stripe)
	    return 'success';
	return 'danger';
    },
    social: function() {
	if (ServiceConfiguration.configurations.find({service:{$ne:"stripe"}}).count()>0)
	    return 'success';
	return 'danger';
    },
    equals: function(a,b) {
	return (a==b);
    },
    curPlan: function () {
	return Session.get('curPlan');
    }
});

Template.admin.events({
    'click .monthly': function (e) {
	e.preventDefault();
	Session.set('curPlan', 'monthly');
    },
    'click .halfYear': function (e) {
	e.preventDefault();
	Session.set('curPlan', 'halfYear');
    },
    'click .yearly': function (e) {
	e.preventDefault();
	Session.set('curPlan', 'yearly');
    }
});

Template.admin.rendered=function () {
    Session.set('curPlan', 'halfYear');
    $('#timeleft').countdown((new Date()).setDate((new Date(Main.findOne().createdAt)).getDate()+30), function(event) {
	$(this).html(event.strftime('%D days %H:%M:%S'));
    });
};
