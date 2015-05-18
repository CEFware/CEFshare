var adminFilter=function (rObj,rName,actionF) {
    if (Meteor.loggingIn()) {
	rObj.render('loading');
    } else {
	var curUser=Meteor.user();
	if (curUser && Roles.userIsInRole(curUser,"admin")) {
	    actionF();
	    rObj.render(rName);
	} else {
	    Router.go('home');
	};
    };
};

var addListingToProfileRecentListings=function (uri) {
    if (Meteor.user().profile.recentListings) {
        current=Meteor.user().profile.recentListings;
	current=_.union(current,[uri]);
        if (current.length>10)
            current=_.rest(current,current.length-10);
        Meteor.users.update({_id:Meteor.userId()},{$set:{'profile.recentListings':current}});
    } else {
        Meteor.users.update({_id:Meteor.userId()},{$set:{'profile.recentListings':[uri]}});
    };
    return true;
};
var addListingToCookie=function (uri) {
    var current=Cookie.get('recentListings');
    if (current) {
	if (current.indexOf(uri)<0) {
	    current = current.split(",");
	    if (current.length>9)
		current = _.rest(current);
	    current.push(uri);
	    Cookie.set('recentListings', current.join(","));
	};
    } else {
	Cookie.set('recentListings',uri);
    };
    return true;
};

Router.configure ({
    layoutTemplate : 'layout',
    loadingTemplate : 'loading',
    notFoundTemplate : 'notFound'
});

//clean mistakes from logins with social profiles
Router.onStop(function () {
    Accounts._loginButtonsSession.resetMessages();
}, {
  only: ['entrySignIn','entrySignUp'], where:'client'
});

Router.onAfterAction(function () {
    //check if there are previous theme-stylesheet
    while (document.getElementById('theme-stylesheet')) {
	document.head.removeChild(document.getElementById('theme-stylesheet'))
    };
    var sc = document.createElement("link");
    sc.setAttribute("rel", "stylesheet");
    sc.setAttribute("id", "theme-stylesheet");
    sc.setAttribute("type", "text/css");
    sc.setAttribute("href", "/css/style."+Main.findOne().design.color+".css");
    document.head.appendChild(sc);
});

Router.map (function () {	    
    this.route('home',{
	template : 'home',
	path : '/',
	action: function () {
	    if (Meteor.user() && (!(Meteor.user().emails[0].address)) && ((Date.now()-Date.parse(Meteor.user().createdAt))<60000))
		Router.go('userProfileEdit',{username:Meteor.user().username});
	    this.subscribe('allListingsActive').wait();
	    if (this.ready()) {
		this.render('home');
	    } else {
		this.render('loading');
	    };
	    this.next();
	},
	onStop: function () {
	    //clear all sessions
	    Session.set('filters',null);
 	}
    });
 
    this.route('terms',{
	template : 'terms',
	path : '/terms'
    });
 
    this.route('privacy',{
	template : 'privacy',
	path : '/privacy'
    });
 
    this.route('about',{
	template : 'about',
	path : '/about'
    });
 
    this.route('how-it-works',{
	template : 'how-it-works',
	path : '/how-it-works'
    });
 
    this.route('contact',{
	template : 'contact',
	path : '/contact'
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

    this.route('user/:username/edit',{
	name: 'userProfileEdit',
	path : '/user/:username/edit',
	onBeforeAction: function (pause) {
	    GoogleMaps.load({
		libraries: 'places'
	    });
	    this.next();
	},
	waitOn: function () {return Meteor.subscribe('userByUsername',this.params.username);},
	action: function () {
	    if ((Meteor.users.findOne({username:this.params.username})) && (Meteor.users.findOne({username:this.params.username})._id===Meteor.userId())) {
		this.render('userProfileEdit');
	    } else {
		this.render('notFound');
	    };
	},
	onStop: function () {
	    //clear all sessions
 	}
    });

    this.route('user/:username/orders',{
	name: 'userOrders',
	path : '/user/:username/orders',
	action: function () {
	    if (Meteor.user() && ((Meteor.user().username===this.params.username) || Roles.userIsInRole(Meteor.userId(),'admin'))) {
		this.subscribe('getUserOrders').wait();
		if (this.ready()) {
		    this.render('userOrdersTemplate');
		} else {
		    this.render('loading');
		};
	    } else {
		this.render('notFound');
	    };
	},
	onStop: function () {
	    //clear all sessions
 	}
    });

    this.route('user/:username/orders/:id',{
	name: 'userOrder',
	path : '/user/:username/orders/:id',
	action: function () {
	    if (Meteor.user() && ((Meteor.user().username===this.params.username) || Roles.userIsInRole(Meteor.userId(),'admin'))) {
		this.subscribe('getOrderById',this.params.id).wait();
		if (this.ready()) {
		    if (Orders.find({idStripe:this.params.id}).count()>0) {
			this.render('userOrderTemplate');
		    } else {
			this.render('notFound');
		    };
		} else {
		    this.render('loading');
		};
	    } else {
		this.render('notFound');
	    };
	},
	onStop: function () {
	    //clear all sessions
            Session.set('stripeCharge',null);
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
	    var uri=this.params.uri;
	    if (uri==='new') {
		Router.go('home');
	    } else {
		var listing=Listings.findOne({uri:uri});
		if (listing) {
		    if (listing.isPublic) {
			addListingToCookie(this.params.uri);
			if (Meteor.user())
			    addListingToProfileRecentListings(this.params.uri);
			this.render('specificListing');
		    } else if (Roles.userIsInRole(Meteor.userId(),['admin']) || (listing.author===Meteor.userId())) {
			addListingToCookie(this.params.uri);
			if (Meteor.user())
			    addListingToProfileRecentListings(this.params.uri);
			this.render('specificListing');
		    } else {
			//or go to homepage
			this.render('notFound');
		    };
		} else {
		    //or go to homepage
		    this.render('notFound');
		};
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
		if (this.params.uri==='new') {
		    Router.go('entrySignIn');
		} else {
		    Router.go('specificListing', {uri:this.params.uri});
		};
	    };
	},
	onStop: function () {
	    //clear all sessions
	    Session.set('listingType',null);
	    Session.set('listingCategory',null);
	}
    });

    this.route('/cart',{
	name: 'cart',
	path : '/cart',
	onBeforeAction: function (pause) {
	    this.next();
	},
	waitOn: function () {},
	action: function () {
	    this.render('cart');
	},
	onStop: function () {
	    //clear all sessions
	}
    });

    this.route('/admin', {
	name: 'admin',
	path: '/admin',
	action: function () {
	    adminFilter(this, 'admin', function() {});
	}
    });

    this.route('/admin/support', {
	name: 'adminSupport',
	path: '/admin/support',
	action: function () {
	    adminFilter(this, 'adminSupport', function() {});
	}
    });

    this.route('/admin/users', {
	name: 'adminUsers',
	path: '/admin/users',
	action: function () {
	    adminFilter(this, 'adminUsers', function() {});
	}
    });

    this.route('/admin/maillist', {
	name: 'adminMaillist',
	path: '/admin/maillist',
	action: function () {
	    adminFilter(this, 'adminMaillist', function() {});
	}
    });

    this.route('/admin/invite', {
	name: 'adminInvite',
	path: '/admin/invite',
	action: function () {
	    adminFilter(this, 'adminInvite', function() {});
	}
    });

    this.route('/admin/transactions', {
	name: 'adminTransactions',
	path: '/admin/transactions',
	action: function () {
	    adminFilter(this, 'adminTransactions', function() {});
	}
    });

    this.route('/admin/basics', {
	name: 'adminBasics',
	path: '/admin/basics',
	action: function () {
	    adminFilter(this, 'adminBasics', function() {});
	}
    });

    this.route('/admin/design', {
	name: 'adminDesign',
	path: '/admin/design',
	action: function () {
	    adminFilter(this, 'adminDesign', function() {});
	}
    });

    this.route('/admin/links', {
	name: 'adminLinks',
	path: '/admin/links',
	action: function () {
	    adminFilter(this, 'adminLinks', function() {});
	}
    });

    this.route('/admin/listingCategories', {
	name: 'adminListingCategories',
	path: '/admin/listingCategories',
	action: function () {
	    adminFilter(this, 'adminListingCategories', function() {});
	},
	onStop: function () {
	    //clear all sessions
	    Session.set('editingCategory',null);
	}
    });

    this.route('/admin/listingFieldsFilters', {
	name: 'adminListingFieldsFilters',
	path: '/admin/listingFieldsFilters',
	action: function () {
	    adminFilter(this, 'adminListingFieldsFilters', function() {});
	},
	onStop: function () {
	    //clear all sessions
	    Session.set('editingTypeName',null);
	}
    });

    this.route('/admin/listingFieldsFilters/:listingType', {
	name: 'adminListingFieldsFiltersTypeView',
	path: '/admin/listingFieldsFilters/:listingType',
	action: function () {
	    adminFilter(this, 'adminListingFieldsFiltersTypeView', function() {});
	},
	onStop: function () {
	    //clear all sessions
	    Session.set('showInactive',null);
	    Session.set('editingField',null);
	}
    });

    this.route('/admin/listingFieldsFilters/:listingType/filter/:field', {
	name: 'adminListingFieldsFiltersFieldFilter',
	path: '/admin/listingFieldsFilters/:listingType/filter/:field',
	action: function () {
	    adminFilter(this, 'adminListingFieldsFiltersFieldFilter', function() {});
	},
	onStop: function () {
	    //clear all sessions
	}
    });

    this.route('/admin/payments', {
	name: 'adminPayments',
	path: '/admin/payments',
	action: function () {
	    adminFilter(this, 'adminPayments', function() {});
	}
    });

    this.route('/admin/social', {
	name: 'adminSocial',
	path: '/admin/social',
	action: function () {
	    adminFilter(this, 'adminSocial', function() {});
	}
    });

    this.route('/admin/analytics', {
	name: 'adminAnalytics',
	path: '/admin/Analytics',
	action: function () {
	    adminFilter(this, 'adminAnalytics', function() {});
	}
    });

    this.route('/admin/instructions', {
	name: 'adminInstructions',
	path: '/admin/instructions',
	action: function () {
	    adminFilter(this, 'adminInstructions', function() {});
	}
    });

    this.route('/admin/emails', {
	name: 'adminEmails',
	path: '/admin/emails',
	action: function () {
	    adminFilter(this, 'adminEmails', function() {});
	}
    });

    this.route('/admin/settings', {
	name: 'adminSettings',
	path: '/admin/settings',
	action: function () {
	    adminFilter(this, 'adminSettings', function() {});
	}
    });

    this.route('/:username',{
	name: 'storefront',
	path : '/:username',
	onBeforeAction: function (pause) {
	    GoogleMaps.load({
		libraries: 'places'
	    });
	    this.next();
	},
	waitOn: function () {return Meteor.subscribe('userByUsername',this.params.username);},
	action: function () {
	    if (Meteor.users.findOne({username:this.params.username})) {
		this.render('storefront');
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
