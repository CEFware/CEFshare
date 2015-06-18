Template.adminInstructions.helpers({
    instructionsSchemaObj: function() {
        return instructionsSchema;
    },
    mainInstructions: function (){
        var res=Main.findOne();
        if (res)
            return res.instructions;
    }
});

AutoForm.addHooks(['adminInstructions'],{
    onSuccess: function (){
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});

Template.adminInstructions.rendered = function () {
    Meteor.subscribe('appSettings');
};
