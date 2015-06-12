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
    }
});
