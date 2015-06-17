Package.describe({
  name: 'our:autoform-bs-datepicker',
  summary: 'Custom bootstrap-datepicker input type for AutoForm',
  version: '1.1.0',
  git: 'https://github.com/aldeed/meteor-autoform-bs-datepicker.git'
});

Package.onUse(function(api) {
  api.use('templating');
  api.use('blaze');
    api.use('aldeed:autoform');
    api.addFiles([
	'autoform-bs-datepicker.html',
    'autoform-bs-datepicker.js'
  ], 'client');
});
