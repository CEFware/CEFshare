Template.adminSupport.helpers({
    contactFormSchema: function() {
        return Schema.contact;
    }
});

AutoForm.addHooks(['contactForm'],{
    onSuccess: function (){
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});
