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

	//here we need to work with variants name & retail_price as in productTemplate.js
	if (cartItems.fetch().length>0) {
	    shopCart.empty=false;
	    cartItems.forEach(function(cartitem){
		var item = _.extend(cartitem,{});
		cartitem.productName = cartitem.product.title;
		cartitem.price = (Number(cartitem.product.price) * cartitem.qty);
		total += cartitem.price;
		shopCart.push(cartitem);
	    });
	} else {
	    shopCart.empty=true;
	};
	shopCart.subtotal = total;
	shopCart.tax = shopCart.subtotal * .06;
	if (shopCart.empty) {
	    shopCart.shipping = 0;
	} else {
	    shopCart.shipping = 10;
	};
	shopCart.total = (shopCart.subtotal + shopCart.shipping) * 1.06;
	return shopCart;
    },
    currency: function(num){
	return '$' + num.toFixed(2);
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

    'click .add': function (){
	Cart.Items.update({_id:this._id},{$set:{qty:(Number(this.qty)+1)}});
    },

    'click .sub': function (){
	//don't let go below 1
	if (Number(this.qty)>1)
	    Cart.Items.update({_id:this._id},{$set:{qty:(Number(this.qty)-1)}});
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
