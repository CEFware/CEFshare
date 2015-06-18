Template.contact.helpers({
    contactFormSchema: function() {
	return Schema.contact;
    },
    mainEmail: function () {
	var res=Main.findOne().basics;
	if (res)
	    return res.marketplaceEmail;
    }
});

AutoForm.addHooks(['contactForm'],{
    onSuccess: function (){
	Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});
