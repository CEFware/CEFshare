Package.describe({
    summary: "Login service for Stripe accounts using Stripe Connect",
    name: "stripe-connect",
    version: "0.0.6",
    git: "https://github.com/chadokruse/meteor-accounts-stripe-connect.git",
});

Package.on_use(function(api) {
    api.versionsFrom('METEOR@1.0');
    api.use('accounts-base', ['client', 'server']);
    api.imply('accounts-base', ['client', 'server']);
    api.use('accounts-oauth', ['client', 'server']);

    api.use('oauth', ['client', 'server']);
    api.use('oauth2', ['client', 'server']);
    api.use('http', ['server']);
    api.use('underscore', 'server');
    api.use('templating', 'client');
    api.use('random', 'client');
    api.use('service-configuration', ['client', 'server']);

    api.add_files("lib/accounts_stripe.js");
    api.add_files('lib/stripe_client.js', 'client');
    api.add_files('lib/stripe_server.js', 'server');
});
