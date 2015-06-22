Template.adminSupport.helpers({
    contactFormSchema: function() {
        return Schema.contact;
    }
});

AutoForm.addHooks(['contactForm'],{
    onSuccess: function (){
	Materialize.toast(TAPi18n.__("Thank you!"),4000);
    }
});
