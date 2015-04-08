Template.userOrdersTemplate.helpers({
    orders: function () {
	return Orders.find();
    },
    amountCurrency : function () {
        res=Orders.findOne({_id:this._id});
        return (res.amount/100)+' '+res.currency;
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
    }
});

Template.userOrdersTemplate.rendered = function () {
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
