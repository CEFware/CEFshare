Template.userInvoicesTemplate.helpers({
    invoicesSent: function () {
	    return Invoices.find({owner:Meteor.userId()});
    },
    invoicesReceived: function () {
	var userEmails=[];
	for (var i=0; i<Meteor.user().emails.length; i++) {
	    userEmails.push(Meteor.user().emails[i].address)
	};
	return Invoices.find({payeeEmail:{$in:userEmails}});
    },
    currency : function (amount) {
        return '$'+(amount/100);
    },
    itemsCount: function () {
	return Invoices.findOne({_id:this._id}).items.length;
    },
    listingImgById: function (image){
        if (image) {
            var imgs=Images.findOne({_id:image});
            if (imgs)
                return imgs.url({store:'thumbs'});
        };
    },
    invoiceDate: function () {
	var res=new Date(this.addedOn);
	return res.toISOString().slice(0,10);
    } 
});

Template.userInvoicesTemplate.rendered = function () {
    Tracker.autorun (function (){
        var listing = Invoices.find();
        if (listing) {
            var imgA=[];
            listing.forEach(function(el){
                imgA=_.union(imgA, el.items[0].product.image[0]);
            });
            Meteor.subscribe('images',imgA);
        };
    });
};
