Template.adminSettings.helpers({
    settingsSchemaObj: function() {
        return settingsSchema;
    },
    mainSettings: function (){
        var res=Main.findOne();
        if (res)
            return res.settings;
    }
});

AutoForm.addHooks(['adminSettings'],{
    onSuccess: function (){
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});

Template.adminSettings.rendered = function () {
    Meteor.subscribe('appSettings');
};
