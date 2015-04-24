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
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});

Template.adminBasics.rendered = function () {
    Meteor.subscribe('appSettings');
};
