Template.userTransactionsTemplate.helpers({
    orders: function () {
	return Orders.find();
    },
    currency : function (amount) {
        return '$'+(amount/100);
    },
    currencyU : function (amount) {
        if (amount)
            return '$'+Number(amount).toFixed(2);
    },
    itemsCount: function () {
	return Orders.findOne({_id:this._id}).items.length;
    },
    listingImgById: function (image){
        if (image) {
            var imgs=Images.findOne({_id:image});
            if (imgs)
                return imgs.url({store:'thumbs'});
        };
    },
    orderDate: function () {
	var res=new Date(this.addedOn);
	return res.toISOString().slice(0,10);
    }, 
    stripeFee : function () {
	return (((this.amount/100)*0.029)+0.3).toFixed(2);
    },
    income : function () {
	return (this.amount/100-this.marketFee-(((this.amount/100)*0.029)+0.3).toFixed(2));
    }
});

Template.userTransactionsTemplate.rendered = function () {
    Tracker.autorun (function (){
        var listing = Orders.find();
        if (listing) {
            var imgA=[];
            listing.forEach(function(el){
                imgA=_.union(imgA, el.items[0].product.image[0]);
            });
            Meteor.subscribe('images',imgA);
        };
    });
};
