Orders = new Mongo.Collection('orders');

var ordersSchema = new SimpleSchema({
    items: {
	type: [Object],
	blackbox: true
    },
    idStripe: {
	type: String,
	optional: true
    },
    status: {
	type: String,
    },
    owner: {
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
    addedOn: {
	type: Date,
	label: 'Date',
	defaultValue: new Date()
    }
});

Orders.attachSchema(ordersSchema);
