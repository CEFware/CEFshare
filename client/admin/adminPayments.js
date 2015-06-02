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
	Meteor.loginWithStripe({
	    stripe_landing: 'register', // or login
	    newAccountDetails: {
		'stripe_user[business_type]': 'non_profit',
		'stripe_user[product_category]': 'charity'
	    }
	}, function (err) {
            if (err){
		console.log('ERROR: ' + err); //error handling
            } else {
		console.log('NO ERROR ON LOGIN'); //show an alert
            }
	});
    }
});
