Template.header.helpers({

    showButton : function () {
	var rObj=Router.current();
	if (rObj && ((rObj.lookupTemplate()==='stepOne') || (rObj.lookupTemplate()==='stepTwo') || (rObj.lookupTemplate()==='stepThree')))
	    return false;
	return true;
    } 

});

//Current year for the footer copyright
Template.footer.helpers({
    currentYear : function(){
        return new Date().getFullYear();}
});

AutoForm.addHooks(['Emails'],{
    onSuccess: function (){
        Flash.success(2,"Thank you!",2000);
    }
});
