Template.adminAnalytics.helpers({
    analyticsSchemaObj: function() {
        return analyticsSchema;
    },
    mainAnalytics: function () {
        var res=Main.findOne();
        if (res)
            return res.analytics;
    }
});

AutoForm.addHooks(['adminAnalytics'],{
    onSuccess: function (){
        Materialize.toast(TAPi18n.__("Thank you!"),2000);
    }
});

Template.adminAnalytics.rendered = function () {
    Meteor.subscribe('appSettings');
};
