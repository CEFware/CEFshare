Template.adminListingCategories.helpers({
    categoriesSchemaObj: function() {
        return categoriesSchema;
    },
    isCategoryLoaded:function(){
        var subs= Meteor.subscribe('categories');
        if(subs.ready())
            return true;
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
    },
    countArr: function (arr) {
	if (arr)
	    return arr.length;
	return 0;
    },
    letDelete: function (catObj) {
	if (catObj.parent) {
	    //children category
	    if (catObj.listings && (catObj.listings.length>0))
		    return false;
	    return true;
	} else {
	    //parent category
	    if (catObj.listings && (catObj.listings.length>0)) {
		    return false;
	    } else {
		//check if no sub categories
		if (Categories.find({parent:catObj.name}).count()>0)
		    return false;
		return true;
	    };
	};
    },
    editingCategory: function (id) {
	if (Session.get('editingCategory')===id)
	    return true;
	return false;
    }
});

AutoForm.addHooks(['adminListingCategories'],{
    onSuccess: function (){
        Materialize.toast(TAPi18n.__("Thank you!"),2000);
    }
});

Template.adminListingCategories.onRendered(function(){
    this.autorun(function(){
       var count= Categories.find({parent: {$exists: false}}).count();
        setTimeout(function(){
            $('select').material_select();
        },500);

    });
});

Template.adminListingCategories.events({
    'click .adminListingCategoryDelete': function (e,t) {
	e.preventDefault();
	Meteor.call('deleteCategory',this._id);
    },
    'click .fa-pencil': function (e,t) {
	e.preventDefault();
	Session.set('editingCategory',this._id);
    }
});

Template.editCategoryName.events({
    'click .stopEdit': function (e,t) {
	e.preventDefault();
	Session.set('editingCategory',null);
    },
    'click .saveEdit': function (e,t) {
	e.preventDefault();
	var newName=t.$('#'+this._id).val();
	if (newName.length>0)
	    Meteor.call('updateCategory',this._id,newName,function (e) {
		if (!e) 
		    Session.set('editingCategory',null);
	    });
    }
});

Template.editCategoryName.rendered = function () {
    $('.newCatName').focus();
};

Template.adminListingCategories.onRendered(function(){
        $('select').material_select();
});
