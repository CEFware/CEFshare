Template.adminListingCategories.helpers({
    categoriesSchemaObj: function() {
        return categoriesSchema;
    },
    categoriesParents: function() {
        var res=Categories.find({parent:{$exists:false}}).fetch();
        if (res.length>0)
            return res;
    },
    categoriesChildren: function() {
        var res=Categories.find({parent:this.name}).fetch();
        if (res.length>0)
            return res;
    }
});

AutoForm.addHooks(['adminListingCategories'],{
    onSuccess: function (){
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});

Template.adminListingCategories.rendered = function () {
    Meteor.subscribe('categories');
};

