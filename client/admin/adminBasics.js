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
        Flash.success(1,TAPi18n.__("Thank you!"),4000);
        Session.set('restartApp',true);
    }
});

Template.adminBasics.rendered = function () {
    Meteor.subscribe('appSettings');
};
