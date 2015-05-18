Meteor.publish('appSettings', function(){
    if (Roles.userIsInRole(this.userId,'admin')) {
	return Main.find();
    };
    return Main.find({},{fields:{publicData:1,listingFields:1,defaultListingFields:1,authorNonFilableFields:1,filters:1,design:1}});
});

Meteor.publish('typesCount', function () {
    Main.findOne().listingFields.forEach( function (el) {
	var res=Listings.find({listingType:el.listingType}).count();
	TypesCount.update({listingType:el.listingType}, {$set: {listingType:el.listingType, amount: res}}, {upsert:true});
    });
    return TypesCount.find();
});
