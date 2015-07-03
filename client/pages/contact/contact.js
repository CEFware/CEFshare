Template.contact.helpers({
    contactFormSchema: function() {
	return Schema.contact;
    },
    mainEmail: function () {
	var res=Main.findOne().basics;
	if (res)
	    return res.marketplaceEmail;
    },
    address: function (key) {
    var res=Main.findOne();
    if (res && res.basics && res.basics.realAddress && res.basics.realAddress[key])
	    return res.basics.realAddress[key];
    return false;
    }
});

AutoForm.addHooks(['contactForm'],{
    onSuccess: function (){
	Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});
