Template.home.helpers({
  contactFormSchema: function() {
    return Schema.contact;
  }
});

AutoForm.addHooks(['contactForm'],{
    onSuccess: function (){
	Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});

Template.home.rendered = function() {
   $('#jsToLoad').html('<script type="text/javascript" src="/js/jquery.cookie.js"></script><script type="text/javascript" src="/js/jquery.inview.min.js"></script><script type="text/javascript" src="/js/owl.carousel.min.js"></script><script type="text/javascript" src="/js/front.js"></script>');
};

Template.slider.helpers({
    sliderItems: function () {
	return allListingsActive();
    },
    listingImg: function (){
        var listing = this;
        if (listing) {
            var imgs=Images.findOne({_id:listing.image[0]});
            if (imgs)
                return imgs.url({store:'slider'});
        };
    }
});

Template.slider.rendered = function() {
    Tracker.autorun(function(){
        Meteor.subscribe('allListingsActive');
        //add id's to get only needed images - by adding an array with needed images id's
        var imgA=[];
        allListingsActive().forEach(function(el){
            imgA=_.union(imgA, el.image);
        });
        Meteor.subscribe('images',imgA);
    });
};
