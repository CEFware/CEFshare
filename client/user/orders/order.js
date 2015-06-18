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
