ServiceConfiguration.configurations.remove({
	service: 'facebook'
});
ServiceConfiguration.configurations.remove({
	service: 'twitter'
});
ServiceConfiguration.configurations.remove({
	service: 'google'
});
ServiceConfiguration.configurations.remove({
	service: 'stripe'
});

var resS=Main.findOne();
if (resS && resS.socialAccounts)
    resS=resS.socialAccounts;

if (resS && resS.twitterConsumerKey && resS.twitterSecret)
    ServiceConfiguration.configurations.insert({
	service: 'twitter',
	consumerKey: resS.twitterConsumerKey,
	secret: resS.twitterSecret
    });

if (resS && resS.fbAppId && resS.fbSecret)
    ServiceConfiguration.configurations.insert({
	service: 'facebook',
	appId: 	resS.fbAppId,
	secret: resS.fbSecret
    });

if (resS && resS.googleClientId && resS.googleSecret)
    ServiceConfiguration.configurations.insert({
	service: 'google',
	clientId: resS.googleClientId,
	secret: resS.googleSecret
    });

//STRIPE
ServiceConfiguration.configurations.insert({
    service: 'stripe',
    appId: Meteor.settings.client_id,
    secret: Meteor.settings.stripe_sk,
    scope: 'read_write'
});

