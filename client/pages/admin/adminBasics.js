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
        Materialize.toast(TAPi18n.__("Thank you! <b>The app will be reloaded in a minute for changes to take place</b>"),4000);
        Session.set('restartApp',true);
    }
});

Template.adminBasics.onRendered(function () {

    $('.ck-editor').ckeditor();
    $('.ck-editor').parent().prepend("<h5>Agreement text</h5>");
    $('.ck-editor').parent().children("label").remove();
    Meteor.subscribe('appSettings');
});

