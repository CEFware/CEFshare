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
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});

Template.adminDesign.rendered = function () {
    Meteor.subscribe('appSettings');
};
