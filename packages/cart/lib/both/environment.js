Cart = {};

Cart.Items = new Mongo.Collection('cart-items');

Cart.Items.allow({
  insert: function(userId, doc) {
    return (userId && doc && userId === doc.userId) || (!userId && doc && doc.deviceId && !doc.userId);
  },
  update: function(userId, doc, fieldNames, modifier) {
    return (userId && doc && userId === doc.userId) || (doc && doc.deviceId && !doc.userId);
  },
  remove: function(userId, doc) {
    return (userId && doc && userId === doc.userId) || (doc && doc.deviceId && !doc.userId);
  },
  fetch: ['userId','deviceId']
});
/*
var myWrapAsync = function (fn, context) {
  var wrapped = Meteor.wrapAsync(fn, context);
  return function () {
    try {
      return wrapped.apply(context, _.toArray(arguments));
    } catch (err) {
      var newErr = new Meteor.Error(err.message);
      for (var key in err) {
        newErr[key] = err[key];
      }
      throw newErr;
    }
  };
};
*/

if(Meteor.isServer){
    if(Meteor.settings && Meteor.settings.stripe_sk){
	Stripe = StripeAPI(Meteor.settings.stripe_sk);
	wrappedStripeChargeCreate = Meteor.wrapAsync(Stripe.charges.create, Stripe.charges);
	wrappedStripeChargeRetrieve = Meteor.wrapAsync(Stripe.charges.retrieve, Stripe.charges);
//	wrappedStripeChargeCreate = myWrapAsync(Stripe.charges.create, Stripe.charges);
    }else{
	console.log('ERROR - stripe secret key not found in settings');
    }
}else{
    if(!Meteor.settings || !Meteor.settings.public || !Meteor.settings.public.stripe_pk) {
	console.log('ERROR - stripe public key not found in settings');
    };
};

Meteor.methods({
    CartPayForItems:function(token, deviceId){
	this.unblock();
	var items, result;
	if(this.userId)
	    items = Cart.Items.find({userId:this.userId});
	else
	    items = Cart.Items.find({deviceId:deviceId});
	
	if(Meteor.isServer){
	    var total = 0;
	    items.forEach(function(item){
		total += Number(item.price)*Number(item.qty);
	    });
	    
	    //shipping
	    var shippingFee=10;
	    total=total+shippingFee;

	    var tax=total*0.06; 
	    total=total+tax;

	    var shipping = Meteor.user().profile.shipping;
	    if (Meteor.user().profile.firstName)
		shipping.firstName=Meteor.user().profile.firstName;
	    if (Meteor.user().profile.lastName)
		shipping.lastName=Meteor.user().profile.lastName;
	    var result = wrappedStripeChargeCreate({
		card: token.id,
		currency: "USD",
		metadata: {orderId:Orders.insert({items:items.fetch(), owner:Meteor.userId(), currency: "USD", amount:Math.floor(total*100), shipping: shipping, shippingFee: shippingFee, tax: tax})},
		amount:Math.floor(total*100)
	    });
	}

	items.forEach(function(item){
	    Cart.Items.remove({_id:item._id});
	});
	
	return result;
    },

    stripeChargeRetrieve: function (id) {
	this.unblock();
	if(Meteor.isServer && id){
	    var result = wrappedStripeChargeRetrieve(id);
	};
	return result;
    }
});
