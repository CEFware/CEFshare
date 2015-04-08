Template.userOrder.helpers({
    items: function () {
	return Orders.findOne().items;
    },
    sum: function (p,q) {
	return Number(p)*Number(q);
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
    amountCurrency : function () {
	res=Orders.findOne();
	return (res.amount/100)+' '+res.currency;
    },
    listingImgById: function (image){
        if (image) {
            var imgs=Images.findOne({_id:image});
            if (imgs)
                return imgs.url({store:'thumbs'});
        };
    }


});

Template.userOrder.rendered = function () {
    Tracker.autorun (function (){
        var listing = Orders.findOne().items;
        if (listing) {
            var imgA=[];
            listing.forEach(function(el){
                imgA=_.union(imgA, el.product.image[0]);
            });
            Meteor.subscribe('images',imgA);
        };
    });
};
