Template.adminPayments.helpers({
    paymentsSchemaObj: function() {
        return paymentsSchema;
    },
    mainPayments: function () {
	var res=Main.findOne();
	if (res)
	    return res.payments;
    },
    stripeConnected: function () {
	var res=Main.findOne();
	if (res && res.stripe)
	    return Main.findOne().stripe;
    },
    stripeRes: function () {
        var res=Session.get('stripeRes');
        switch (res) {
            case "sameAs":
            Flash.danger('stripeAdmMsg',TAPi18n.__("Another account using the same Stripe account was found!"),10000);
            Session.set('stripeRes',null);
            break;
            case "success":
            Flash.success('stripeAdmMsg',TAPi18n.__("Thank you!"),2000);
            Session.set('stripeRes',null);
            break;
            default:
            break;
        };
    }
});

AutoForm.addHooks(['adminPayments'],{
    onSuccess: function (){
        window.scrollTo(0,0);
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});

Template.adminPayments.rendered = function () {
    Meteor.subscribe('appSettings');
};

Template.adminPayments.events({
    'click .stripe-connect': function(e, t){
	e.preventDefault();
	if (Roles.userIsInRole(Meteor.userId(),'admin'))
	    Meteor.loginWithStripe({
		stripe_landing: 'login' // or register
	    }, function (err) {
		if (err){
		    if (err.message.indexOf('correctly added')>-1) {
			Meteor.call('addStripeToMain',Meteor.user().services.stripe, function (e) {
			    if (!e) 
				Meteor.call('disconnectStripe');
			});
		    } else if (err.message.indexOf('Another account registered')>-1) {
			Flash.danger(1,TAPi18n.__("Another account using the same Stripe account was found!"),2000);
		    } else if (err.message.indexOf('No matching login attempt found ')>-1) {
		    } else {
			console.log('ERROR: ' + err); //error handling
		    };
		} else {
		};
	});
    },
    'click .stripe-disconnect': function(e, t){
	e.preventDefault();
	if (confirm(TAPi18n.__("Are you sure?")) && Roles.userIsInRole(Meteor.userId(),'admin'))
	    //call method to delete from user profile & MAIN schema
	    Meteor.call('disconnectStripeAdmin');
    }
});

Template.stripeMarket.rendered=function () {
    Meteor.call('addStripeToMain',Meteor.user().services.stripe.process, function (e) {
	if (!e) { 
            Session.set('stripeRes','success');
        } else if (e.error==='duplicate-found') {
            Session.set('stripeRes','sameAs');
        } else {
            console.log(err);
        };
    });
};

