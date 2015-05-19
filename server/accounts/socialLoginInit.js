ServiceConfiguration.configurations.remove({
	service: 'facebook'
});
ServiceConfiguration.configurations.remove({
	service: 'twitter'
});
ServiceConfiguration.configurations.remove({
	service: 'google'
});

//Localhost settings - to be commented on server
/**//*
ServiceConfiguration.configurations.insert({
	service: 'facebook',
	appId: "284489131716704",
	secret: "bfaebbe2568ba28ee7b01d3bdefefa0c"
});
ServiceConfiguration.configurations.insert({
	service: 'twitter',
	consumerKey: "jlyDDrnUqVUDUaftGTuwLzWKL",
	secret: "LMbfNc68MyFLDnvIA6d1qA9umaagJBMviWFWIfI4vcPayLG8ty"
});
ServiceConfiguration.configurations.insert({
	service: 'google',
	clientId: "959803676418-3dveuplq6ve2v1q1odlfolok7pb0aja5.apps.googleusercontent.com",
	secret: "CxIfE_72DS2qJQCiiARSvCs9"
});
/**/

//staging settings - to be commented on localhost
/**/
var resS=Main.findOne().socialAccounts

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
/**/
