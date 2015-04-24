Template.adminTransactions.helpers({
    listAllOrders: function () {
        return Orders.find();
    },
    orderDate: function () {
	if (this.addedOn) {
            var res=new Date(this.addedOn);
            return res.toISOString().slice(0,10);
	};
    },
    listingImgById: function (image){
        if (image) {
            var imgs=Images.findOne({_id:image});
            if (imgs)
                return imgs.url({store:'thumbs'});
        };
    },
    merchants: function () {
	var m=[];
	this.items.forEach(function (el) {
	   m= _.union(m,[el.product.authorUsername]);
	});
	return m;
    },
    currency: function (amount) {
        return accounting.formatMoney(amount/100);
     }
});

Template.adminTransactions.rendered = function () {
    Tracker.autorun(function(){
        Meteor.subscribe('adminOrdersList');
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
