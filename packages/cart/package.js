Package.describe({
    summary: "Cart",
    name: "cart",
    summary: "A simple and pluggable shopping cart that uses stripe for payments",
  	version: "0.0.5",
    git: "https://github.com/nate-strauser/meteor-cart.git"
});

Package.on_use(function (api) {
	api.versionsFrom("METEOR@0.9.0");
	Npm.depends({ "stripe": "2.8.0" });

	api.use([
	    'tracker',
	    'templating',
	    'session',
	    'amplify'
		]
	  , 'client');

	api.use([
		'iron:router', 'mongo', 'underscore', 'accounts-base', 'random'
		], ['server','client']);

	
	api.addFiles('lib/stripe/stripe_client.js', 'client');
	api.addFiles('lib/stripe/stripe_checkout.js', 'client');
	api.addFiles('lib/stripe/stripe_server.js', 'server');

    api.add_files(['lib/both/environment.js'], ['client','server']);
    api.add_files(['lib/client/cart.html','lib/client/cart.js'], 'client');
    api.add_files(['lib/server/publications.js'], 'server');

    api.export('Cart', ['client','server']);
});
