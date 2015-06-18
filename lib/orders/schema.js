Orders = new Mongo.Collection('orders');
UnavailableDates = new Mongo.Collection('unavailableDates');

var ordersSchema = new SimpleSchema({
    items: {
	type: [Object],
	blackbox: true
    },
    idStripe: {
	type: String,
	optional: true
    },
    stripeResult: {
	type: Object,
	blackbox: true,
	optional: true
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
    orderNum: {
        type: Number,
        label: function () {return TAPi18n.__('Order number')},
        autoValue: function() {
	    a=new Date(); 
	    b=a.getFullYear()*100+a.getMonth()+1;
	    c=(b*100+a.getDate())*100000;
            if (this.isInsert) {
		var num=Orders.findOne({},{sort:{addedOn:-1}}).orderNum%100000;
		while (Orders.find({orderNum:(c+num)}).count()>0) {
		    num++;
		};
                return (c+num);
            } else {
		return this.value;
	    };
        }
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

Orders.attachSchema(ordersSchema);
