languagesOptions = function (variant) {
    var arrR=[];
    switch (variant) {
        case "codes":
        _.each(TAPi18n.getLanguages(),function (v,k,o) {
            arrR.push(k);
        });
        break;
        case "options":
        _.each(TAPi18n.getLanguages(),function (v,k,o) {
            arrR.push({value: k, label: v.name});
        });
        break;
    };
    return arrR;
};

Schema = {};

Schema.contact = new SimpleSchema({
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        label: function () {return TAPi18n.__("E-mail address")}
    },
    message: {
        type: String,
        label: function () {return TAPi18n.__("Message")},
        max: 1000
    }
});

Schema.emails = new SimpleSchema({
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        label: function () {return TAPi18n.__("E-mail address")}
    },
    createdAt: {
	type: Date,
	autoValue: function() {
            if (this.isInsert) {
		return new Date;
            } else if (this.isUpsert) {
		return {$setOnInsert: new Date};
            } else {
		this.unset();
            }
	}
    }
});

Emails.attachSchema(Schema.emails);
