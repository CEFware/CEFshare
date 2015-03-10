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
	name: 'specificListing',
	waitOn: function () {return Meteor.subscribe('specificListingByURI',this.params.uri);},
	action: function () {
	    var listing=Listings.findOne({uri:this.params.uri});
	    if (listing) {
		if (listing.isPublic) {
		    this.render('specificListing');
		} else if (Roles.userIsInRole(Meteor.userId(),['admin']) || (listing.author===Meteor.userId())) {
		    this.render('specificListing');
		} else {
                    Router.go('home');
		};
	    } else {
		//or go to homepage
		this.render('notFound');
	    };
	},
	onStop: function () {
	    //clear all sessions
	}
    });
 
    this.route('listing/:uri/edit',{
	path : '/listing/:uri/edit',
	name: 'specificListingEdit',
	waitOn: function () {return Meteor.subscribe('specificListingByURI',this.params.uri);},
	action: function () {
	    if (Meteor.user()) {
		if (this.params.uri==='new') {
		    this.render('specificListingEdit');
		} else {
		    var listing=Listings.findOne({uri:this.params.uri});
		    if (listing) {
			if (Roles.userIsInRole(Meteor.userId(),['admin']) || (listing.author===Meteor.userId())) {
			    this.render('specificListingEdit');
			} else {
			    Router.go('specificListing', {uri:this.params.uri});
			};
		    };
		};
	    } else {
		Router.go('specificListing', {uri:this.params.uri});
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
