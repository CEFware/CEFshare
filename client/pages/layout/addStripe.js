Template.addStripe.helpers({
    mainStripe: function () {
	return Main.findOne().stripe;
    }
});
