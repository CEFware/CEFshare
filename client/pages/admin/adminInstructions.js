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
        Materialize.toast(TAPi18n.__("Thank you!"),2000);
    }
});

Template.adminInstructions.onRendered(function () {
    Meteor.subscribe('appSettings');
    $('.ck-signup').ckeditor();
    $('.ck-signup').parent().children('label').remove();
    $('.ck-signup').parent().prepend('<h5>Signup info</h5>');

    $('.ck-footer').ckeditor();
    $('.ck-footer').parent().children('label').remove();
    $('.ck-footer').parent().prepend('<h5>"Get the news" footer text</h5>');
});
