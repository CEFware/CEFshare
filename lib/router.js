Router.configure ({
    layoutTemplate : 'layout',
    loadingTemplate : 'loading',
    notFoundTemplate : 'notFound'
});

Router.map (function () {	    
    this.route('home',{
	template : 'home',
	path : '/'
    });
 
    this.route('terms',{
	template : 'terms',
	path : '/terms'
    });
 
    this.route('privacy',{
	template : 'privacy',
	path : '/privacy'
    });
 
    this.route('notFound', { path: '*' });
});

Router.route('/external/:url', function () {
    this.response.writeHead(302, {
	'Location': "http://" + this.params.url
    });
    this.response.end();
}, {where:'server'});
