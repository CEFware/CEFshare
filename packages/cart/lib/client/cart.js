Cart.subscriptionHandles = {
	userOrders:Meteor.subscribe("Cart-userOrders")
};

Tracker.autorun(function(){
	if(!Session.equals('Cart-deviceId', undefined))
		Cart.subscriptionHandles.deviceOrders = Meteor.subscribe("Cart-deviceOrders", Session.get('Cart-deviceId'));
});

Tracker.autorun(function(){
	if(!Meteor.userId() && Session.equals('Cart-deviceId', undefined)){
		var deviceId = amplify.store("Cart-deviceId");
		if(!deviceId){
			deviceId = Random.id();
			amplify.store("Cart-deviceId", deviceId);
		}
		Session.set('Cart-deviceId', deviceId);
	}else if(Meteor.userId()){
		Cart.Items.find({
			userId:{$exists:false},
			deviceId: Session.get('Cart-deviceId')
		},{fields:{userId:1,deviceId:1}}).forEach(function(order){
			Cart.Items.update({
				_id:order._id
			},{
				$set:{userId:Meteor.userId()},
				$unset:{deviceId:1}
			},function(error){
				if(error)
					console.log(error);
			});
		});
		Session.set('Cart-deviceId', undefined);
	}
});

Session.setDefault('Cart-itemCount', 0);
Session.setDefault('Cart-itemTotal', 0);
Tracker.autorun(function(){
    var query = {};
    if(Meteor.userId())
	query.userId = Meteor.userId();
    else
	query.deviceId = Session.get('Cart-deviceId');
    
    var total = 0;
    var shippingFee = 0;
    var tax = 0;
    var items = Cart.Items.find(query, {fields: {price: 1, qty:1, 'product.shippingFee': 1, 'product.tax': 1}});
    items.forEach(function(item){
	total += item.price*item.qty;
	shippingFee += item.product.shippingFee*item.qty;
	tax += (item.price + item.product.shippingFee)*item.qty*(item.product.tax/100);
    });
    
    //shipping
    total=total+Number(shippingFee.toFixed(2));;

    //tax
    total=total+Number(tax.toFixed(2));

    total=Number(total.toFixed(2));

    Session.set('Cart-itemTotal', Math.floor(total*100)/100);
    Session.set('Cart-itemCount', items.count());
});

Template.CartAddItemButton.events({
    'click .add-item':function(event, template){
	event.preventDefault();

	//TODO - need to take an attribute hash and send in all values
	var item = {};
	if(!Meteor.userId()){
	    item.deviceId = Session.get('Cart-deviceId');
	}else{
	    item.userId = Meteor.userId();
	};

	var qty = 1;
	var listing = specificListingByURI(Router.current().params.uri).fetch()[0];
        if (listing) {
	    item.qty=qty;
	    item.product=listing;
	    item.price=listing.price;
	    Cart.Items.insert(item);
	    //in case we do mistake - and do need to delete all the cart items: uncomment the line below & and add anything to the cart, comment this line again 
//		Cart.Items.find().forEach(function (e){Cart.Items.remove({_id:e._id});});
	};
    }
});

Template.CartSummary.helpers({
	'itemCount':function(){
		return Session.get('Cart-itemCount');
	},
	'itemTotal':function(){
		return Session.get('Cart-itemTotal');
	},
	'itemsInCart':function(){
		return !Session.equals('Cart-itemCount', 0);
	}
});


var StripeCheckoutHandler;

Template.CartPayNow.events({
    'click #pay-now':function(event, template){
	event.preventDefault();
	var res = Meteor.user();
	if (res) { 
	    if (res.profile && res.profile.firstName && res.profile.shipping && res.profile.shipping.firstLine && res.profile.shipping.city && res.profile.shipping.zip && res.profile.shipping.country) {
		StripeCheckoutHandler.open({
		    description: Session.get('Cart-itemCount') + ' items ($' + Session.get("Cart-itemTotal") + ')',
		    amount: Math.floor(Session.get("Cart-itemTotal") * 100),
		    bitcoin:true
		});
	    } else {
		alert(TAPi18n.__("Please, state your shipping address in PROFILE"));
	    };
	} else {
	    Router.go('entrySignIn');
	};
    }
});

Template.CartPayNow.rendered = function(){
    StripeCheckoutHandler = StripeCheckout.configure({
	key: "pk_test_9Da2pggVWZY3kxoQ85iK2qRD",//Meteor.settings.public.stripe_pk,
	token: function(token) {
	    Meteor.call("CartPayForItems", token, Session.get('Cart-deviceId'), function(error, result) {
		if (error) {
		    alert(JSON.stringify(error));
		}else{
		    var order={};
		    order.id=result.id;
		    //we need to save all the carges id's to keep track the client orders
		    Orders.update({_id:result.metadata.orderId}, {$set:{idStripe:result.id,status:"paid"}});
		    alert("Payment Complete");
		    Router.go('userOrder',{username:Meteor.user().username,id:result.id});
		}
	    });
	}
    });
};

/*
Router.route('/cart', function () {
  this.render('CartItems', {
    data: function () { 
    	var query = {};
		if(Meteor.userId())
			query.userId = Meteor.userId();
		else
			query.deviceId = Session.get('Cart-deviceId');
			
		return {
    		items:Cart.Items.find(query),
    		hasItems:!Session.equals('Cart-itemCount', 0),
    		itemCount:Session.get('Cart-itemCount'),
			itemTotal:Session.get('Cart-itemTotal')
    	};
    }
  });
});

Template.CartItem.events({
	'click .remove':function(event, template){
		event.preventDefault();
		if(confirm("Are You Sure?"))
			Cart.Items.remove({_id:this._id});
	}
});
*/
