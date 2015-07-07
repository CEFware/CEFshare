/**
 * Created by piyushthapa on 7/7/15.
 */
Template.wishlistWrapper.onCreated(function () {
    this.subscribe('wishlist',this.data.user);
});
Template.wishlistWrapper.helpers({
   wishlist:function(){
        return Wishlist.find();
   }
});