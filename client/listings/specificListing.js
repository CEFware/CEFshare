Template.SpecificArtwork.helpers({
    artworkImg: function (){
	var artwork = specificArtworkWithCanonicalTitle(Router.current().params.name).fetch().first();
	if (artwork) {
	    var imgs=Images.findOne({_id:artwork.image});
	    if (imgs)
		return imgs.url();
	};
    },
    artworkImgById: function (image){
	if (image) {
	    var imgs=Images.findOne({_id:image});
	    if (imgs)
		return imgs.url();
	};
    },

    artworksByAuthor: function (author){
	return publicArtworksByAuthor(author);
    },

    artworksByTags: function (tags){
	return allArtworksByTags(tags);
    },

    artwork: function () {
	return specificArtworkWithCanonicalTitle(Router.current().params.name).fetch().first();
    },
    products: function () {
	return productsFromArtworksWithCanonicalTitle(Router.current().params.name);
    },
    isFavorited: function () {
	var artwork = specificArtworkWithCanonicalTitle(Router.current().params.name).fetch().first();
	if (artwork)
	    return isArtworkFavorited(artwork._id);
	return false;
    },
    isArtworkOwner: function () {
	var artwork = specificArtworkWithCanonicalTitle(Router.current().params.name).fetch().first();
	if (artwork && (artwork.author===Meteor.userId()))
	    return true;
	return false;
    }
});

Template.SpecificArtwork.events({
  'click .switchFavorite': function () {
    var artwork = specificArtworkWithCanonicalTitle(Router.current().params.name).fetch().first();

    return switchFavoriteArtworkState(artwork._id);
  }
});

Template.SpecificArtwork.rendered = function () {
    
    $('.seeRel').on('click', function() {
	$('.relatedArts').velocity({translateX: "-100%"},{easing: 'swing' , duration: 1000});  
    });

    $('h3').on('click', function() {
	$('.relatedArts').velocity({translateX: "100%"},{easing: 'swing' , duration: 1000});
    });

    Tracker.autorun (function (){

	Meteor.subscribe('wishlist');
	var artwork = specificArtworkWithCanonicalTitle(Router.current().params.name).fetch().first();
	if (artwork) {
	    Meteor.subscribe('userById',artwork.author);
	    Meteor.subscribe('getPublicArtworksByAuthor',artwork.author);
	    Meteor.subscribe('getArtworksByTags',artwork.tags);
	    var imgA=[];
	    allArtworks().forEach(function(el){
		imgA.push(el.image);
	    });
	    Meteor.subscribe('images',imgA);
	};
    });
    
};
