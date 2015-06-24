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
};

Template.afQuickField.onRendered(function(){
   var card=$('.card-panel');
  card.removeClass('card-panel');
});