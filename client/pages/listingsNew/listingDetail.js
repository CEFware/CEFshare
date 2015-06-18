/**
 * Created by piyushthapa on 6/18/15.
 */
Template.listingDetail.onCreated(function(){

});
Template.listingDetail.onRendered(function(){

});
Template.listingDetail.helpers({
    imageLoaded:function(){
        var subs=Meteor.subscribe('images',this.image);
        if(subs.ready())
            return true;
    },
    authorListing:function(){
        if(Meteor.userId())
            return this.author==Meteor.userId();
    }

});

/*
    Listing Image Template Functions
 */
Template.listingImages.onCreated(function(){
   this.currentImageIndex=new ReactiveVar(0);
});
Template.listingImages.helpers({
    getThumbnail:function(index,store,id){
        var listing = this;
        console.log(id);
        if (listing) {
            if(id)
                var imgs=Images.findOne({_id:id});
            else
                var imgs=Images.findOne({_id:listing.image[Template.instance().currentImageIndex.get()]});

            if (imgs)
                return imgs.url(store[store]);
            //return imgs.url();
        };
    }

});
Template.listingImages.events({
   'click .imgs-thumbs':function(e,t){
       e.preventDefault();
       var index=Template.instance().data.image.indexOf(this.valueOf());
       Template.instance().currentImageIndex.set(index);

   }
});
Template.listingImages.onRendered(function(){
    $('.picZoomer').picZoomer();
});