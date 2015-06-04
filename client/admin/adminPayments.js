Template.adminPayments.helpers({
    socialSchemaObj: function() {
        return socialSchema;
    },
    mainSocial: function () {
	var res=Main.findOne();
	if (res)
	    return res.socialAccounts;
    }
});


Template.adminPayments.rendered = function () {
    Meteor.subscribe('appSettings');
};

Template.adminPayments.events({
    'click .stripe-connect': function(e, t){
	if (Roles.userIsInRole(Meteor.userId(),'admin'))
	    Meteor.loginWithStripe({
		stripe_landing: 'login' // or register
	    }, function (err) {
		if (err){
		    if (err.message.indexOf('correctly added')>-1) {
			Meteor.call('addStripeToMain',Meteor.user().services.stripe);
		    } else {
			console.log('ERROR: ' + err); //error handling
		    };
		} else {
		};
	});
    },
    'click .stripe-disconnect': function(e, t){
	if (confirm(TAPi18n.__("Are you sure?")) && Roles.userIsInRole(Meteor.userId(),'admin'))
	    //call method to delete from user profile & MAIN schema
	    Meteor.call('disconnectStripeAdmin');
    }
});
