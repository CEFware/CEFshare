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
	Materialize.toast(TAPi18n.__("Thank you! <b>The app will be reloaded in a minute for changes to take place</b>"),4000);
	Session.set('restartApp',true);
    }
});

Template.adminDesign.rendered = function () {
    Meteor.subscribe('appSettings');
    Meteor.subscribe('design');
};
