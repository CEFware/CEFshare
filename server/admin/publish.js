Meteor.publish('appSettings', function(){
    if (Roles.userIsInRole(this.userId,'admin')) {
	return Main.find();
    };
    return Main.find({},{fields:{publicData:1,
				 listingFields:1,
				 defaultListingFields:1,
				 authorNonFilableFields:1,
				 filters:1,
				 design:1,
				 basics:1,
				 instructions:1,
				 'socialAccounts.fbHandle':1,
				 'socialAccounts.twitterHandle':1,
				 'socialAccounts.googleHandle':1
				}});
});

Meteor.publish('typesCount', function () {
    Main.findOne().listingFields.forEach( function (el) {
	var res=Listings.find({listingType:el.listingType}).count();
	TypesCount.update({listingType:el.listingType}, {$set: {listingType:el.listingType, amount: res}}, {upsert:true});
    });
    return TypesCount.find();
});

Meteor.publish('maillist', function(){
    if (Roles.userIsInRole(this.userId,'admin')) {
	return Maillist.find();
    };
});

