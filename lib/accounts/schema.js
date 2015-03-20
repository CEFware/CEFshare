User = {};

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
    twitter: {
	type: String,
	optional: true
    },
    country: {
	type: User.UserCountry,
	optional: true
    },
    recentListings: {
	type: [String],
	optional: true
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
