/**
 * Created by piyushthapa on 6/18/15.
 */
Template.listingNew.onCreated(function(){
    var instance=this;
    switch (this.data.publishTemplate){
        case 'getListingsByAuthor':
            instance.subscribe(instance.data.publishTemplate,instance.data.author,instance.data._id);
            return true;
        case 'allListingsActive':
            instance.subscribe(instance.data.publishTemplate);
        default :
            return null;
    }


});
Template.listingNew.helpers({
    listing:function(){

        if(this.author && this._id)
            var listing=Listings.find({_id:{$ne:this._id}});
        else
            var listing= Listings.find();

        return listing;
    }
});

Template.listingData.helpers({
   imageLoaded:function(){
       var subs=Meteor.subscribe('images',[this.image[0]]);
       if(subs.ready())
           return true;
   },
   getThumbnail:function(index){
       var listing = this;
       console.log(listing);
       if (listing && listing.image) {
           var imgs=Images.findOne({_id:listing.image[parseInt(index)]});
           if (imgs)
               return imgs.url({store:'thumbs'});
       };
   }
});
Template.listingData.events({
   'click .card-wrapper':function(e){
       e.preventDefault();
       $('#'+this._id+'-back').toggleClass('flip-back');
       $('#'+this._id).toggleClass('flip-front');
   },
    'click .btn-link':function(e){
        e.preventDefault();
        var href = $(e.target).attr('href');
        Router.go(href);
    }
});
