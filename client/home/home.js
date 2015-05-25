Template.home.helpers({
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
    },
    cover: function () {
	var res=Main.findOne();
	if (res && res.design && res.design.coverPhotoUse)
	    return res.design.coverPhotoUse;
	return false;
    },
    coverPhoto: function () {
        var pr=Main.findOne();
        if (pr) {
            var res=Design.findOne({_id:pr.design.coverPhoto});
            if (res)
                return res.url({store:"cover"});
        };
        return "/img/CEF_cover.jpg";
    },
    still: function () {
	var res=Main.findOne();
	if (res && res.design && res.design.stillPhotoUse)
	    return res.design.stillPhotoUse;
	return true;
    },
    stillPhoto: function () {
        var pr=Main.findOne();
        if (pr) {
            var res=Design.findOne({_id:pr.design.stillPhoto});
            if (res)
                return res.url({store:"still"});
        };
        return "/img/CEF_still.jpg";
     }
});

Template.home.events({
    'click .search-btn': function (e,t) {
	e.preventDefault();
	Session.set('homeSearch', $('#search-box').val().trim());
    }
});

Template.home.rendered = function() {
   $('#jsToLoad').html('<script type="text/javascript" src="/js/jquery.cookie.js"></script><script type="text/javascript" src="/js/jquery.inview.min.js"></script><script type="text/javascript" src="/js/owl.carousel.min.js"></script><script type="text/javascript" src="/js/front.js"></script>');
    Tracker.autorun(function(){
        //add id's to get only needed images - by adding an array with needed images id's
        var imgA=[];
        allListingsActive().forEach(function(el){
            imgA=_.union(imgA, el.image);
        });
        Meteor.subscribe('images',imgA);
    });
};
