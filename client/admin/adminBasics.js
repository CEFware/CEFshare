Template.adminBasics.helpers({
    basicsSchemaObj: function() {
        return basicsSchema;
    },
    mainBasics: function (){
        var res=Main.findOne();
        if (res)
            return res.basics;
     }
});

AutoForm.addHooks(['adminBasics'],{
    onSuccess: function (){
        window.scrollTo(0,0);
        Flash.success(1,TAPi18n.__("Thank you! <b>The app will be reloaded in a minute for changes to take place</b>"),2000);
 	Meteor.call('restartApp');
    }
});

Template.adminBasics.rendered = function () {
    Meteor.subscribe('appSettings');
};
