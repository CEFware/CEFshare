Template.userInvoiceTemplate.helpers({
    items: function () {
	return Invoices.findOne({invoiceNum:Number(Router.current().params.id)}).items;
    },
    currency : function (amount) {
	if (amount)
            return '$'+Number(amount).toFixed(2);
    },
    itemTotal: function () {
	return (this.price*this.qty).toFixed(2);
    },
    stripeCharge: function () {
/*
	Meteor.call('stripeChargeRetrieve', Router.current().params.id, function (e,r) {
	    if (!e) {
		return Session.set('stripeCharge',r);
	    } else {
		console.log(e);
	    };
	}); 
	return Session.get('stripeCharge');
*/
    },
    listingImgById: function (image){
        if (image) {
            var imgs=Images.findOne({_id:image});
            if (imgs)
                return imgs.url({store:'thumbs'});
        };
    },
    order: function () {
	return Invoices.findOne();
    },
    orderSubtotal: function (){
	var res=0;
	for (var i=0; i<this.items.length; i++) {
	    res+=this.items[i].price*this.items[i].qty;
	};
	return res;
    },
    orderTotal: function (){
	return this.amount/100;
    },
    orderDateTime: function (date) {
	if (date) {
            var res=new Date(date);
	} else {
            var res=new Date(this.addedOn);
	};
        return res.toISOString().slice(0,16).replace('T',' ');
    },
    clientData: function () {
	var cD=this.clientData;
	return _.filter(getCustomFields(this.product), function (el) {return ((!el.authorFilable) && (cD[el.name]))});
    },
    exactData: function (data) {
	return data[this.name];
    },
    card: function () {
	if (this.object==="card")
	    return true;
	return false;
    }
});

Template.userInvoiceTemplate.events({
    'click .payInvoice' : function (e,t) {
        e.preventDefault();
	if (Meteor.user()) {
            var item = {};
            var result = Invoices.findOne().items[0].clientData;
            var listing = Invoices.findOne().items[0].product;
            if (listing) {
		item.qty=result.qtyToBuy;
		item.product=listing;
		item.price=listing.price;
		item.clientData=result;
		Session.set('curBuyItem',[item]);
		var total=item.qty*listing.price+listing.shippingFee;
		total=total+total*listing.tax/100;
		total=Number(total.toFixed(2));
		//here we need to charge
		StripeCheckoutHandler.open({
                    description: 'Buy '+item.qty+' "'+listing.title + '" for $' + total,
                    amount: Math.floor(total * 100),
                    bitcoin:true
		});
            };
	    
            Flash.success(1,TAPi18n.__("Thank you!"),2000);
	} else {
            Router.go('entrySignIn');
	};
    }
});

Template.userInvoiceTemplate.rendered = function () {
    Tracker.autorun (function (){
        var listing = Invoices.findOne({invoiceNum:Number(Router.current().params.id)});
        if (listing && listing.items) {
	    var imgA=[];
	    listing.items.forEach(function(el){
                imgA=_.union(imgA, el.product.image[0]);
	    });
	    Meteor.subscribe('images',imgA);

	    Meteor.call('getStripeKey', listing.owner, function (e,key) {
		if (!e) {
                    StripeCheckoutHandler = StripeCheckout.configure({
			key: key,
			token: function(token) {
                            Meteor.call("CartPayForItems", token, Session.get('curBuyItem'), function(error, result) {
				if (error) {
                                    alert(JSON.stringify(error));
				}else{
                                    var order={};
                                    order.id=result.id;
                                    //we need to save all the carges id's to keep track the client orders
                                    Orders.update({_id:result.metadata.orderId}, {$set:{idStripe:result.id,status:"paid",stripeResult:result}});

				    Meteor.call('setInvoiceOrderNum',Router.current().params.id,result.metadata.orderId);
                                    //initiate application_fee transfer from platform to marketplace owner
				    
                                    var curm=Main.findOne();
                                    var fee=0;
                                    if (curm && curm.payments) {
					switch (curm.payments.feeOrPercentage) {
					case "fee":
                                            fee=curm.payments.fee;
                                            break;
					case "percentage":
                                            fee=(result.amount/100)*curm.payments.percentage/100;
                                            fee=Number(fee.toFixed(2));
                                            break;
					};
                                    };
				    if (fee>0) {
					var transferObj={
					    amount:Math.round(Number(fee*100)),
					    destination:Main.findOne().stripe.id, //key of marketplace owner
					    source_transaction: result.application_fee,
					    currency:result.currency
					};
					Meteor.call('appFeeFromPlatform',transferObj);
				    };
                                    alert("Payment Complete");
				    if (Meteor.user())
					Router.go('/user/'+Meteor.user().username+'/orders/'+result.id);
				}
                            });
			}
                    });
		};
	    });
        };
    });
};
