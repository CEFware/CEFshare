Template.adminDesign.helpers({
    designSchemaObj: function() {
        return designSchema;
    },
    mainDesign: function (){
        var res=Main.findOne();
        if (res)
            return res.design;
    }
});

AutoForm.addHooks(['adminDesign'],{
    onSuccess: function (){
	window.scrollTo(0,0);
        Flash.success(1,TAPi18n.__("Thank you! <b>The app will be reloaded in a minute for changes to take place</b>"),2000);
	Meteor.call('restartApp');
    }
});

Template.adminDesign.rendered = function () {
    Meteor.subscribe('appSettings');
    Meteor.subscribe('design');
};
