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
        Flash.success(2,TAPi18n.__("Thank you!"),2000);
    }
});

UI.registerHelper('serviceConfigured', function () {
    if (this.toString()==='stripe') return false;
    return ServiceConfiguration.configurations.findOne({service:this.toString()});
});

UI.registerHelper('showOR', function () {
    if (ServiceConfiguration.configurations.find({service:{$ne:'stripe'}}).count()>0)
	return true;
    return false;
});
