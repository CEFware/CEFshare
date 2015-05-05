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
    },
    countArr: function (arr) {
	if (arr)
	    return arr.length();
	return 0;
    },
    letDelete: function (catObj) {
	if (catObj.parent) {
	    //children category
	    if (catObj.listings && (catObj.listings.length()>0))
		    return false;
	    return true;
	} else {
	    //parent category
	    if (catObj.listings && (catObj.listings.length()>0)) {
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
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});

Template.adminListingCategories.rendered = function () {
    Meteor.subscribe('categories');
};

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
	Meteor.call('updateCategory',this._id,newName,function (e) {
	    if (!e) 
		Session.set('editingCategory',this._id);
	});
    }
});

Template.editCategoryName.rendered = function () {
    $('.newCatName').focus();
};
