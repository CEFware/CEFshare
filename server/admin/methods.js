var makeId= function (n)
{
    if (!n)
	n=5;
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";
//    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for( var i=0; i < n; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

Meteor.methods({
    saveAdminSocial: function (doc) {
	if (Roles.userIsInRole(Meteor.userId(),'admin')) {
	    check(doc, socialSchema);
	    var query={socialAccounts :doc};
	    var cur=Main.findOne();
	    if (cur) {
		Main.update({_id:cur._id},{$set:query});
	    } else {
		Main.insert(query);
	    };
	};
    },
    saveAdminBasics: function (doc) {
	if (Roles.userIsInRole(Meteor.userId(),'admin')) {
	    check(doc, basicsSchema);
	    var query={basics :doc};
	    var cur=Main.findOne();
	    if (cur) {
		Main.update({_id:cur._id},{$set:query});
	    } else {
		Main.insert(query);
	    };
	};
    },
    saveAdminLinks: function (doc) {
	if (Roles.userIsInRole(Meteor.userId(),'admin')) {
	    check(doc, linksSchema);
	    var query={menuLinks :doc};
	    var cur=Main.findOne();
	    if (cur) {
		Main.update({_id:cur._id},{$set:query});
	    } else {
		Main.insert(query);
	    };
	};
    },
    saveAdminAnalytics: function (doc) {
	if (Roles.userIsInRole(Meteor.userId(),'admin')) {
	    check(doc, analyticsSchema);
	    var query={analytics :doc};
	    var cur=Main.findOne();
	    if (cur) {
		Main.update({_id:cur._id},{$set:query});
	    } else {
		Main.insert(query);
	    };
	};
    },
    saveAdminInstructions: function (doc) {
	if (Roles.userIsInRole(Meteor.userId(),'admin')) {
	    check(doc, instructionsSchema);
	    var query={instructions :doc};
	    var cur=Main.findOne();
	    if (cur) {
		Main.update({_id:cur._id},{$set:query});
	    } else {
		Main.insert(query);
	    };
	};
    },
    saveAdminEmails: function (doc) {
	if (Roles.userIsInRole(Meteor.userId(),'admin')) {
	    check(doc, emailsSchema);
	    var query={emails :doc};
	    var cur=Main.findOne();
	    if (cur) {
		Main.update({_id:cur._id},{$set:query});
	    } else {
		Main.insert(query);
	    };
	};
    },
    saveAdminSettings: function (doc) {
	if (Roles.userIsInRole(Meteor.userId(),'admin')) {
	    check(doc, settingsSchema);
	    var query={settings :doc};
	    var cur=Main.findOne();
	    if (cur) {
		Main.update({_id:cur._id},{$set:query});
	    } else {
		Main.insert(query);
	    };
	};
    },
    saveAdminListingCategories: function (doc) {
	if (Roles.userIsInRole(Meteor.userId(),'admin')) {
	    check(doc, categoriesSchema);
//	    doc.fields=['title', 'description', 'details', 'image', 'price', 'shippingFee', 'tax', 'tags'];
	    var query=doc;
	    Categories.insert(query);
	};
    },
    saveAdminListingTypes: function (doc) {
	if (Roles.userIsInRole(Meteor.userId(),'admin')) {
	    doc.listingFields=defaultFields;
	    check(doc, typeListingField);
	    var query=doc;
	    var cur=Main.findOne();
	    Main.update({_id:cur._id}, {$addToSet:{listingFields:query}});
	};
    },
    deleteListingType: function (name) {
	if (Roles.userIsInRole(Meteor.userId(),'admin')) {
	    //check if no listings of that type
            if (!(Listings.find({listingType:name}).count()>0)) {
		var cur=Main.findOne();
		Main.update({_id:cur._id}, {$pull:{listingFields:{listingType:name}}});
	    };
	};
    },
    saveAdminListingTypeNewField: function (doc) {
	if (Roles.userIsInRole(Meteor.userId(),'admin')) {
	    //if this type is filable by author
            if (Main.findOne({'authorNonFilableFieldsTitles':doc.name})) {
		doc.authorFilable=false;
	    } else {
		doc.authorFilable=true;
	    };
	    check(doc, oneListingField);
	    var typeName=doc.name;
	    var cur=Main.findOne();
	    var arr=[];
	    //get all current listings fields names in one array of uniq values
	    cur.listingFields.forEach(function (el){
		    el.listingFields.forEach(function (el2) {
			arr.push(el2.name);
		    });
	    });
	    arr=_.uniq(arr);
	    //do increase new name addition until it becomes uniq in that array
	    doc.name=makeId();
            while (arr.indexOf(doc.name)>-1) {
		doc.name=makeId();
            };
	    var query=doc;
	    Main.update({_id:cur._id, "listingFields.listingType":typeName}, {$addToSet:{"listingFields.$.listingFields":query}});
	};
    },
    deleteListingField: function (field,lType) {
	if (Roles.userIsInRole(Meteor.userId(),'admin')) {
	    var query={}
	    query[field.name]={$exists:true};
	    if ((Listings.find(query).count()===0) && (field.active)) {
		//if no listings with that field & it's active - delete
		Main.update({"listingFields.listingType":lType}, {$pull:{"listingFields.$.listingFields":field}});
	    } else {
		var updatedFields=[];
		Main.findOne().listingFields.forEach(function (el){
		    if (el.listingType===lType)
			el.listingFields.forEach(function (el2) {
			    if (el2.name===field.name) {
				if (field.active) {
				    el2.active=false;
				} else {
				    el2.active=true;
				};
			    };
			    updatedFields.push(el2);
			});
		});
		Main.update({"listingFields.listingType":lType}, {$set:{"listingFields.$.listingFields":updatedFields}});
	    };
	};
    },
    updateListingField: function (field,lType) {
	if (Roles.userIsInRole(Meteor.userId(),'admin')) {
	    var updatedFields=[];
	    Main.findOne().listingFields.forEach(function (el){
		if (el.listingType===lType)
		    el.listingFields.forEach(function (el2) {
			if (el2.name===field.name) {
			    updatedFields.push(field);
			} else {
			    updatedFields.push(el2);
			};
		    });
	    });
	    Main.update({"listingFields.listingType":lType}, {$set:{"listingFields.$.listingFields":updatedFields}});
	};
    },
    updateListingType: function (lType,newName) {
	if (Roles.userIsInRole(Meteor.userId(),'admin')) {
	    //update all the listings of that type
	    Listings.update({listingType:lType},{$set:{listingType:newName}},{multi:true})
	    //update Listing TYpe name
	    Main.update({'listingFields.listingType':lType},{$set:{'listingFields.$.listingType':newName}});
	};
    },
    saveAdminFilterUpdate : function (doc) {
	if (Roles.userIsInRole(Meteor.userId(),'admin')) {
	    if (!Main.findOne().filters) 
		Main.update({},{$set:{filters:[]}},{upsert:1});
	    if (Main.findOne({'filters.fieldName':doc.fieldName})) {
		Main.update({'filters.fieldName':doc.fieldName},{$set:{"filters.$":doc}})
	    } else {
		Main.update({},{$addToSet:{filters:doc}})
	    };
	};	
    }
});
