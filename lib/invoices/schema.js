Invoices = new Mongo.Collection('invoices');

var invoicesSchema = new SimpleSchema({
    items: {
	type: [Object],
	blackbox: true
    },
    status: {
	type: String,
    },
    owner: {
        type: String,
        autoValue: function() {
            return Meteor.userId();
        }
    },
    ownerUsername: {
        type: String,
        autoValue: function() {
            return Meteor.user().username;
        }
    },
    payeeUserId: {
        type: String,
	optional:true
    },
    payeeEmail: {
        type: String
    },
    currency: {
	type: String
    },
    shippingFee: {
	type: Number,
	decimal: true
    },
    tax: {
	type: Number,
	decimal: true
    },
    amount: {
	type: Number
    },
    shipping: {
	type: User.shipping
    },
    marketFee: {
	type: Number,
	decimal: true
    },
    invoiceNum: {
        type: Number,
        label: function () {return TAPi18n.__('Invoice number')},
        autoValue: function() {
	    a=new Date(); 
	    b=a.getFullYear()*100+a.getMonth()+1;
	    c=(b*100+a.getDate())*100000;
            if (this.isInsert) {
		var num=Invoices.findOne({},{sort:{addedOn:-1}});
		if (num && num.invoiceNum) {
		    num=num.invoiceNum%100000;
		    while (Invoices.find({invoiceNum:(c+num)}).count()>0) {
			num++;
		    };
		} else {
		    num=1;
		};
                return (c+num);
            } else {
		return this.value;
	    };
        }
    },
    orderNum: {
        type: Number,
        label: function () {return TAPi18n.__('Order number')},
	optional: true
    },
    addedOn: {
        type: Date,
        label: function () {return TAPi18n.__('Date')},
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

Invoices.attachSchema(invoicesSchema);
