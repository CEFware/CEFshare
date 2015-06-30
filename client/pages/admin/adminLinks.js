Template.adminLinks.helpers({
    linksSchemaObj: function() {
        return linksSchema;
    },
    mainLinks: function() {
        var res=Main.findOne();
        if (res)
            return res.menuLinks;
    }
 });

AutoForm.addHooks(['adminLinks'],{
    onSuccess: function (){
        Materialize.toast(TAPi18n.__("Thank you!"),2000);
    }
});

Template.adminLinks.rendered = function () {
    Meteor.subscribe('appSettings');
    $('.ck-editor').ckeditor();
    $('.ck-editor').parent().children('label').remove();
};

Template.afQuickField.onRendered(function(){
   var card=$('.card-panel');
  card.removeClass('card-panel');
});
