Template.cart.helpers({
    notEmpty : function (obj) {
        if (obj)
            return true;
        return false;
    },
    cartItems: function(){
        var shopCart = [];
        var cartItems = Cart.Items.find({});
        var total = 0;
        var shippingFee = 0;
        var tax = 0;

	//here we need to work with variants name & retail_price as in productTemplate.js
	if (cartItems.fetch().length>0) {
	    shopCart.empty=false;
	    cartItems.forEach(function(cartitem){
		var item = _.extend(cartitem,{});
		cartitem.productName = cartitem.product.title;
		cartitem.price = (Number(cartitem.product.price) * cartitem.qty);
		total += cartitem.price;
		shippingFee += cartitem.product.shippingFee*cartitem.qty;
		tax += (cartitem.price+(cartitem.product.shippingFee*cartitem.qty))*(cartitem.product.tax/100); 
		shopCart.push(cartitem);
	    });
	} else {
	    shopCart.empty=true;
	};
	shopCart.subtotal = accounting.toFixed(Number(total),2);
	shopCart.tax = accounting.toFixed(Number(tax),2);
	shopCart.shipping = accounting.toFixed(Number(shippingFee),2);
	shopCart.total = accounting.toFixed((Number(shopCart.subtotal) + Number(shopCart.shipping) + Number(shopCart.tax)),2);
	return shopCart;
    },
    currency: function(num){
	return accounting.formatMoney(num);
    },

    isRecentListings: function () {
        var uriArr=Cookie.get('recentListings');
        if (uriArr)
            uriArr = uriArr.split(",");
        if ((uriArr.length>0) && (allListingsByURI(uriArr,null,3).fetch().length>0))
            return true;
        return false;
    },

    recentListings: function () {
        var uriArr=Cookie.get('recentListings');
        uriArr = uriArr.split(",");
        return allListingsByURI(uriArr,null,3);
    },

    listingImgById: function (image){
        if (image) {
            var imgs=Images.findOne({_id:image});
            if (imgs)
                return imgs.url({store:'thumbs'});
        };
    }

})

Template.cart.events({
    'click .removeFromCart':function(e){
	e.preventDefault();
        if(confirm(TAPi18n.__("Are You Sure?")))
            Cart.Items.remove({_id:this._id});
     },
    'change .qty': function (e,t) {
	var val=$(e.currentTarget).val();
	if (val>0) {
	    Cart.Items.update({_id:this._id},{$set:{qty:Number(val)}});
	} else {
	    $(e.currentTarget).val(1);
	    if (this.qty!=1)
		Cart.Items.update({_id:this._id},{$set:{qty:1}});
	};
    }
});

Template.cart.rendered = function () {
//add here images for cart items
    Tracker.autorun (function (){
        var uriArr=Cookie.get('recentListings');
        if (uriArr)
            uriArr = uriArr.split(",");
        if (uriArr.length>0)
            Meteor.subscribe('getListingsByURI',uriArr);
        var imgA=[];
        allListings().forEach(function(el){
            imgA=_.union(imgA, el.image);
        });
        Meteor.subscribe('images',imgA);
    });
};
