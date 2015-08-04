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
    notFoundTemplate : 'notFound',
    trackPageView: true
});

//clean mistakes from logins with social profiles
Router.onStop(function () {
    Accounts._loginButtonsSession.resetMessages();
}, {
  only: ['entrySignIn','entrySignUp'], where:'client'
});

Router.onBeforeAction(function () {
    if (!Meteor.isServer) {
	var curUser=Meteor.user();
	if (curUser) {
	    if (Roles.userIsInRole(curUser,"banned")) {
		this.render('banned');
	    } else if (Roles.userIsInRole(curUser,"unverified")) { 
		this.render('unverified');
	    } else {
		this.next();
	    };
	} else {
	    this.next();
	};
    } else {
	this.next();
    };
}, {except: ['home', 'userProfileEdit', 'contact', 'terms', 'privacy', 'pages', 'entrySignOut']});

Router.onBeforeAction(function () {
    if (!Meteor.isServer) {
	this.subscribe('design');
	this.subscribe('pages');
	this.subscribe('appSettings');
    };
    this.next();
});

Router.map (function () {	    
    this.route('home',{
	template : 'home',
	path : '/',
	action: function () {
	    if (Meteor.user() && (!(Meteor.user().emails[0].address)) && ((Date.now()-Date.parse(Meteor.user().createdAt))<60000))
		Router.go('/user/'+Meteor.user().username+'/edit');
	    this.subscribe('allListingsActive').wait();
	    this.subscribe('filtersData').wait();
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
            Session.set('stripeRes',null);
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

    this.route('user/:username/transactions',{
	name: 'userTransactions',
	path : '/user/:username/transactions',
	action: function () {
	    if (Meteor.user() && ((Meteor.user().username===this.params.username) || Roles.userIsInRole(Meteor.userId(),'admin'))) {
		this.subscribe('getUserTransactions').wait();
		if (this.ready()) {
		    this.render('userTransactionsTemplate');
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

    this.route('user/:username/transactions/:id',{
	name: 'userTransaction',
	path : '/user/:username/transactions/:id',
	action: function () {
	    if (Meteor.user() && ((Meteor.user().username===this.params.username) || Roles.userIsInRole(Meteor.userId(),'admin'))) {
		this.subscribe('getOrderById',this.params.id).wait();
		if (this.ready()) {
		    if (Orders.find({idStripe:this.params.id}).count()>0) {
			this.render('userTransactionTemplate');
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
	waitOn: function () {
	    return [Meteor.subscribe('specificListingByURI',this.params.uri),
		    Meteor.subscribe('unavailableDates', this.params.uri)];
	},
	action: function () {
	    var uri=this.params.uri;
	    if (uri==='new') {
		Router.go('/listing/new/edit');
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
	    Session.set('daysNum', null);
	    Session.set('curBuyItem', undefined);
	}
    });
 
    this.route('listing/:uri/edit',{
	path : '/listing/:uri/edit',
	name: 'specificListingEdit',
	waitOn: function () {return Meteor.subscribe('specificListingByURI',this.params.uri);},
	action: function () {
	    if (Meteor.user()) {
		if (this.params.uri==='new') {
		    if (Meteor.user().services.stripe && Main.findOne() && Main.findOne().stripe) {
			this.render('specificListingEdit');
		    } else {
			this.render('addStripe');
		    };
		} else {
		    var listing=Listings.findOne({uri:this.params.uri});
		    if (listing) {
			if (Roles.userIsInRole(Meteor.userId(),['admin']) || (listing.author===Meteor.userId())) {
			    this.render('specificListingEdit');
			} else {
			    Router.go('/listing/'+this.params.uri);
			};
		    };
		};
	    } else {
		if (this.params.uri==='new') {
		    Router.go('entrySignIn');
		} else {
		    Router.go('/listing/'+this.params.uri);
		};
	    };
	},
	onStop: function () {
	    //clear all sessions
	    Session.set('listingType',null);
	    Session.set('listingCategory',null);
	    Session.set('stripeRes',null);
	    Session.set('itemName',null);
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
	},
	onStop: function () {
	    Session.set('curPlan', undefined);
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
	},
	onStop: function () {
	    //clear all sessions
	    Session.set('joined',null);
	}
    });

    this.route('/admin/maillist', {
	name: 'adminMaillist',
	path: '/admin/maillist',
	action: function () {
	    adminFilter(this, 'adminMaillist', function() {});
	},
	onStop: function () {
	    Session.set('msgId',null);
	    Session.set('numUsersNow',null);
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
        waitOn: function () {
            return [Meteor.subscribe('pages'),Meteor.subscribe('blocks')];
        },
        action: function () {
            adminFilter(this, 'adminLinks', function() {});
        },
        onStop: function () {
            Session.set('pageId',null);
            Session.set('blockId',null);
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
	},
	onStop: function () {
	    //clear all sessions
            Session.set('stripeRes',null);
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

Router.route('/pages/:uri', {
    loadingTemplate: 'loading',
    waitOn: function () {
        return [Meteor.subscribe('pages',this.params.uri)];
    },
    action: function () {
        var page=Pages.findOne({uri:this.params.uri});
        if (page) {
            //get the block names from page
            var res=_.map(page.page.match(/\[block (.*?)\]/g), function (el) {return el.match(/\[block (.*?)\]/)[1]})
            if (res.length>0) {
                //subscribe to those blocks only
                Meteor.subscribe('blocks',res);
                var blocks = Blocks.find().fetch();
                if (blocks.length>0) {
                    blocks.forEach(function (el) {
                        var re=RegExp('\\[block '+el.uri+'\\]');
                        page.page=page.page.replace(re,el.page)
                    })
                    this.render('customPage',{
                        data:function(){
                            return page;
                        }});
                } else {
                    this.render('loading');
                };
            } else {
                this.render('customPage',{
                    data:function(){
                        return page;
                    }});
            };
        } else {
            this.render('notFound');
        };
    }
});

Router.route('/stripetoken', {where:'server'}).get(
    function () {

	var getTokenResponse = function (query) {
            var config = ServiceConfiguration.configurations.findOne({service: 'stripe'});
            if (!config) {
		throw new ServiceConfiguration.ConfigError("Service not configured");
            };

            var responseContent;

            try {
		// Request an access token
		responseContent = HTTP.post(
                    "https://connect.stripe.com/oauth/token", {
			params: {
                            client_id:     config.appId,
                            client_secret: OAuth.openSecret(config.secret),
                            code:          query.code,
                            grant_type:    'authorization_code',
                            redirect_uri: Meteor.absoluteUrl("_oauth/stripe?close")
			}
                    }).content;

            } catch (err) {
		throw _.extend(new Error("Failed to complete OAuth handshake with stripe. " + err.message),
                               {response: err.response});
            }
            // Success!  Extract the stripe access token and key
            // from the response
            var parsedResponse = JSON.parse(responseContent);

            var stripeAccessToken = parsedResponse.access_token;
            var stripeRefreshToken = parsedResponse.refresh_token;
            var stripe_id = parsedResponse.stripe_user_id;
            var stripe_publishable_key = parsedResponse.stripe_publishable_key;

            if (!stripeAccessToken) {
		throw new Error("Failed to complete OAuth handshake with stripe " +
				"-- can't find access token in HTTP response. " + responseContent);
            }
            return {
		accessToken: stripeAccessToken,
		refreshToken: stripeRefreshToken,
		stripe_user_id: stripe_id,
		stripe_publishable_key: stripe_publishable_key
            };
	};

	this.response.writeHead(200, {'Content-Type': 'text/html'});
	this.response.end();

	if (this.params.query.user_id) {

	    var response = getTokenResponse(this.params.query); //state scope code
	    var accessToken = response.accessToken;
	    var refreshToken = response.refreshToken;

	    var serviceData = {
		accessToken: accessToken,
		refreshToken: refreshToken,
		stripe_publishable_key: response.stripe_publishable_key,
		stripe_user_id: response.stripe_user_id,
		id: response.stripe_user_id
	    };

	    var user_id=response.user_id;
	    Meteor.users.update({_id:this.params.query.user_id},{$set:{'services.stripe.process':serviceData}});
	    
	} else {
	    console.log('Stripe OAuth with no data - strange!');
	};
    }
);
