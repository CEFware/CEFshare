Orders = new Mongo.Collection('orders');

var ordersSchema = new SimpleSchema({
    items: {
	type: [Object],
	blackbox: true
    },
    owner: {
	type: String
    },
    currency: {
	type: String
    },
    amount: {
	type: Number
    },
    addedOn: {
	type: Date,
	label: 'Date',
	defaultValue: new Date()
    }
});

Orders.attachSchema(ordersSchema);
