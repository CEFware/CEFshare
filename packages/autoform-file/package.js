Package.describe({
  name: "our:autoform-file",
  summary: "File upload for AutoForm",
  description: "File upload for AutoForm",
  version: "0.2.3",
  git: "http://github.com/yogiben/autoform-file.git"
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.0');

  api.use(
    [
    'underscore',
    'templating',
    'less@1.0.0 || 2.5.0',
    'aldeed:autoform',
	'cfs:ui'
    ],
    'client');

    api.imply([
	'cfs:ui'
    ]);

  api.add_files('lib/client/autoform-file.html', 'client');
  api.add_files('lib/client/autoform-file.less', 'client');
  api.add_files('lib/client/autoform-file.js', 'client');
});
