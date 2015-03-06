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
