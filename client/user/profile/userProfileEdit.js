Template.userProfileEdit.helpers({
    user: function () {
	return User.User;
    },
    mapOptions: function() {
        // Make sure the maps API has loaded
        var lat=44.816667;
        var lng=20.466667;
        //get here current user location LatLng
        if (Meteor.user() && Meteor.user().formatted_address && Meteor.user().lat && Meteor.user().lng){
            lat=Meteor.user().lat;
            lon=Meteor.user().lng;
        };
        if (GoogleMaps.loaded()) {
            // Map initialization options
            return {
                center: new google.maps.LatLng(lat, lng),
                zoom: 10
            };
        };
    },
    notEmpty : function (obj) {
        if (obj)
            return true;
        return false;
    },
    oauthService: function() {
        return AccountsTemplates.oauthServices();
    },
    showService: function () {
	if (this._id==='stripe')
	    return false;
	return true;
   }
});

AutoForm.addHooks(['EditUserProfilePage'],{
    onSuccess: function (){
        Flash.success('profileSaved',TAPi18n.__("Saved successfuly!"),2000);
    },
    onError: function (o,e,t) {
        Flash.danger('profileSaved',TAPi18n.__("Something is wrong! Error: ")+e.reason,3000);
    }
});

Template.userProfileEdit.events({
    'click #find': function () {
        event.preventDefault();
        $("#geocomplete").trigger('geocode');
    },
    'click .dropPassword': function (event, template) {
        event.preventDefault();
        Meteor.call('dropPassword', function (error, result){
            if (! error) {
		Flash.success('profileSaved',TAPi18n.__("Secret link to set up you new password was sent to your e-mail recently!"),2000);
            } else {
		Flash.danger('profileSaved',TAPi18n.__("Error happened while sending drop password to your e-mail!"),2000);
            };
        });
    },
    'click .stripe-connect': function(e, t){
        Meteor.loginWithStripe({
            stripe_landing: 'register', // or login
            newAccountDetails: {
                'stripe_user[business_type]': 'non_profit',
                'stripe_user[product_category]': 'charity'
            }
        }, function (err) {
                if (err){
                    if (err.message.indexOf('correctly added')>-1) {
                    } else {
                        console.log('ERROR: ' + err); //error handling
                    };
                } else {
                };
        });
    },
    'click .stripe-disconnect': function(e, t){
        if (confirm(TAPi18n.__("Are you sure?")))
            //call method to delete from user profile only
            Meteor.call('disconnectStripe');
    }
});

Template.userProfileEdit.rendered=function () {
    var loc=Meteor.user().formatted_address;
    if (loc) {
	var options={map:".map-canvas", location: loc, details: "form", types: ["geocode","establishment"]};
    } else {
	var options={map:".map-canvas", details: "form", types: ["geocode","establishment"]};
    };
    setTimeout(function () {
        if (GoogleMaps.loaded()) $("#geocomplete").geocomplete(options);
    }, 1000);
};

