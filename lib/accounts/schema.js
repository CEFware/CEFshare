User = {};

User.shipping = new SimpleSchema({
    firstName: {
	type: String,
	optional:true
    },
    lastName: {
	type: String,
	optional:true
    },
    firstLine: {
	type: String,
        label: function () {return TAPi18n.__("Street - 1st line")},
	optional:true
    },
    secondLine: {
	type: String,
        label: function () {return TAPi18n.__("Street - 2nd line")},
	optional:true
    },
    city: {
	type: String,
        label: function () {return TAPi18n.__("City")},
	optional:true
    },
    zip: {
	type: String,
        label: function () {return TAPi18n.__("ZIP")},
	optional:true
    },
    state: {
	type: String,
        label: function () {return TAPi18n.__("State")},
	optional:true
    },
    country: {
	type: String,
        label: function () {return TAPi18n.__("Country")},
	optional:true
    }
});

User.UserProfile = new SimpleSchema({
    bio:{
	type:String,
        label: function () {return TAPi18n.__("Bio")},
	optional:true
    },
    firstName: {
	type: String,
	regEx: /^[a-zA-Z]{2,25}$/,
        label: function () {return TAPi18n.__("First name")},
 	optional: true
    },
    lastName: {
	type: String,
	regEx: /^[a-zA-Z]{2,25}$/,
        label: function () {return TAPi18n.__("Last name")},
	optional: true
    },
    name: {
	type: String,
	optional: true
    },
    birthday: {
	type: Date,
	optional: true
    },
    gender: {
	type: String,
	allowedValues: ['male', 'female'],
        label: function () {return TAPi18n.__("Gender")},
	optional: true
    },
    organization: {
	type: String,
	regEx: /^[a-z0-9A-z .]{3,30}$/,
	optional: true
    },
    website: {
	type: String,
	regEx: SimpleSchema.RegEx.Url,
	optional: true
    },
    recentListings: {
	type: [String],
	optional: true
    },
    shipping: {
	type: User.shipping,
	optional: true
    },
    phone : {
	type: String,
        label: function () {return TAPi18n.__("Telephone")},
	optional: true
    },
    notAvailableDays: {
	type: [Number],
	allowedValues: [0,1,2,3,4,5,6],
	autoform: {
            type: "select-checkbox-inline",
 	    options: {
		0: "Sunday",
		1: "Monday",
		2: "Tuesday",
		3: "Wednesday",
		4: "Thursday",
		5: "Friday",
		6: "Saturday"
	    }
	},
	optional:true,
        label: function () {return TAPi18n.__("Set unavailable days of week")}
	
    },
    notAvailableDates: {
	type: String,
	optional:true,
	autoform: {
            afFieldInput: {
                type: "bootstrap-datepicker"
            }
	},
        label: function () {return TAPi18n.__("Set unavailable dates")}
    }
});

User.User = new SimpleSchema({
    username: {
	type: String,
	optional: true
    },
    emails: {
	type: [Object],
	optional: true
    },
    "emails.$.address": {
	type: String,
	regEx: SimpleSchema.RegEx.Email,
        label: function () {return TAPi18n.__("E-mail")},
	optional: true
    },
    "emails.$.verified": {
	type: Boolean,
	optional: true
    },
    registered_emails: {
	type: [Object],
	optional: true,
	blackbox: true
    },
    createdAt: {
	type: Date,
	defaultValue: new Date(),
	optional: true
    },
    profile: {
	type: User.UserProfile,
	optional: true
    },
    services: {
	type: Object,
	optional: true,
	blackbox: true
    },
    roles: {
	type: Object,
	optional: true,
	blackbox: true
    },
    followers:{
	type:[String],
	optional: true
    },
    formatted_address: {
	type: String,
	optional: true
    },
    lat: {
	type: Number,
	decimal: true,
	optional: true
    },
    lng: {
	type: Number,
	decimal: true,
	optional: true
    }
});

Meteor.users.attachSchema(User.User);
