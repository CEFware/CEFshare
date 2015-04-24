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
    }
});
