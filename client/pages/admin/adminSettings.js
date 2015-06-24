Template.adminSettings.helpers({
    settingsSchemaObj: function() {
        return settingsSchema;
    },
    mainSettings: function (){
        var res=Main.findOne();
        if (res)
            return res.settings;
    },
    isEqual:function(parm){
        return this.name==parm;
    }
});

AutoForm.addHooks(['adminSettings'],{
    onSuccess: function (){
        Materialize.toast(TAPi18n.__("Thank you!"),2000);
    }
});

Template.adminSettings.onRendered(function () {
    Meteor.subscribe('appSettings');
    //console.log($('.select-wrapper').parent());
    $('.select-wrapper').parent().children('label').addClass('label-dark');
});

