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
 
    this.route('user',{
	path : '/user',
	action: function () {
	    Router.go('home');
	}
    });
 
    this.route('user/:username',{
	name: 'userProfile',
	path : '/user/:username',
	onBeforeAction: function (pause) {
	    GoogleMaps.load({
		libraries: 'places'
	    });
	    this.next();
	},
	waitOn: function () {return Meteor.subscribe('userByUsername',this.params.username);},
	action: function () {
	    if (Meteor.users.findOne({username:this.params.username})) {
		this.render('userProfile');
	    } else {
		this.render('notFound');
	    };
	},
	onStop: function () {
	    //clear all sessions
	}
    });

    this.route('listing',{
	path : '/listing',
	action: function () {
	    Router.go('home');
	}
    });
 
    this.route('listing/:uri',{
	path : '/listing/:uri',
	waitOn: function () {return Meteor.subscribe('listingByURI',this.params.uri);},
	action: function () {
	    if (Listings.findOne({uri:this.params.uri})) {
		this.render('specificListing');
	    } else {
		this.render('notFound');
	    };
	},
	onStop: function () {
	    //clear all sessions
	}
    });
 
    this.route('notFound', { path: '*' });
});

Router.route('/external/:url', function () {
    this.response.writeHead(302, {
	'Location': "http://" + this.params.url
    });
    this.response.end();
}, {where:'server'});
