Template.userOrderTemplate.helpers({
    items: function () {
	return Orders.findOne({idStripe:Router.current().params.id}).items;
    },
    currency : function (amount) {
	if (amount)
            return '$'+Number(amount).toFixed(2);
    },
    itemTotal: function () {
	return (this.price*this.qty).toFixed(2);
    },
    stripeCharge: function () {
	Meteor.call('stripeChargeRetrieve', Router.current().params.id, function (e,r) {
	    if (!e) {
		return Session.set('stripeCharge',r);
	    } else {
		console.log(e);
	    };
	}); 
	return Session.get('stripeCharge');
    },
    listingImgById: function (image){
        if (image) {
            var imgs=Images.findOne({_id:image});
            if (imgs)
                return imgs.url({store:'thumbs'});
        };
    },
    order: function () {
	return Orders.findOne();
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
    orderDate: function () {
        var res=new Date(this.addedOn);
        return res.toISOString().slice(0,10);
    }
});

Template.userOrderTemplate.rendered = function () {
    Tracker.autorun (function (){
        var listing = Orders.findOne({idStripe:Router.current().params.id});
        if (listing && listing.items) {
	    var imgA=[];
	    listing.items.forEach(function(el){
                imgA=_.union(imgA, el.product.image[0]);
	    });
	    Meteor.subscribe('images',imgA);
        };
    });
};
