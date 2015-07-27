Template.addStripe.helpers({
    mainStripe: function () {
	var res=Main.findOne();
	if (res && res.stripe)
	    return res.stripe;
    }
});
