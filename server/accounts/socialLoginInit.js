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
ServiceConfiguration.configurations.insert({
	service: 'twitter',
	consumerKey: "ojyyVrU0G11mhMgMDPuPoeWyG",
	secret: "bssVKnnXSKzVoaoyhty3IcSeE45aJzf3SGwOaHnVlTgwnK1NvV"
});
ServiceConfiguration.configurations.insert({
	service: 'facebook',
	appId: "826479787389546",
	secret: "c95d160223e2c54495d39b41cf4c6f66"
});
ServiceConfiguration.configurations.insert({
	service: 'google',
	clientId: "",
	secret: ""
});
/**/
