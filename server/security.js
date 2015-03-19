//checks if user is a current document owner
Security.defineMethod("ifOwner",{
    deny: function (type, arg, userId, doc, fieldNames){
        if (doc.user_id && (doc.user_id===userId))
            return false;
         if (doc._id && (doc._id===userId))
            return false;
        if (doc.author && (doc.author===userId))
            return false;
        return true;
    }
});

//nobody may remove & update 
Emails.permit(['remove','update']).never().apply();

//anybody may insert
Emails.permit(['insert']).apply();

//Listings - only verified user may insert, admin & owner remove, only owner - update
Listings.permit(['insert','update','remove']).ifLoggedIn().ifHasRole('admin').apply();
Listings.permit(['insert','update','remove']).ifLoggedIn().ifOwner().apply();

//Wishlist - user may do anything with own items
Wishlist.permit(['insert','update','remove']).ifLoggedIn().ifOwner().apply();

//Users - admin do anything, and user do anything with his profile, anybody may update followers -
Users = Meteor.users;
Security.permit(['insert','update','remove']).collections([Users]).ifLoggedIn().ifHasRole('admin').apply();
Security.permit(['insert','update','remove']).collections([Users]).ifLoggedIn().ifOwner().apply();
Security.permit(['update']).collections([Users]).ifLoggedIn().onlyProps(['followers']).apply();

//Images - only verified user may insert, admin & owner remove, only owner - update
//SAMPLE CURRENTLY
Images.allow({
    insert: function(userId, doc){
	if (userId)
            return true;
    },
    remove: function(userId, doc){
	if ((userId===doc.author) || Roles.userIsInRole(userId,'admin'))
            return true;
    },
    update: function(userId, doc, fieldNames, modifier){
	if ((userId===doc.author) || Roles.userIsInRole(userId,'admin'))
            return true;
    },
    download: function(userId, doc){
        return true;
    }
});
Images.deny({
    insert: function(userId, doc){
	if (userId)
            return false;
    },
    remove: function(userId, doc){
	if ((userId===doc.author) || Roles.userIsInRole(userId,'admin'))
            return false;
    },
    update: function(userId, doc, fieldNames, modifier){
	if ((userId===doc.author) || Roles.userIsInRole(userId,'admin'))
            return false;
    },
    download: function(userId, doc){
        return false;
    }
});

