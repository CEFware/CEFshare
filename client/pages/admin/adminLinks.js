Template.adminLinks.helpers({
    pagesSchemaObj: function() {
        return pagesSchema;
    },
    pages: function() {
        var res=Pages.find();
        if (res)
            return res;
    },
    fType: function () {
        var resId=Session.get('pageId');
        if (resId)
            return "update";
        return "insert";
    },
    curPage: function () {
        var resId=Session.get('pageId');
        if (resId) {
            var resPage=Pages.findOne({_id:resId});
            if (resPage) {
                return resPage;
            };
        };
        return false;
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
    $('.ck-editor').parent().prepend('<h6>Page text</h6>');
};

Template.adminLinks.events({
    'click .delPage': function (e,t) {
        e.preventDefault();
        if (Session.get('pageId')===this._id) {
            $('[name=title]').val("");
            Session.set('pageId',null);
        };
        Meteor.call('deletePage',this._id);
    },
    'click .cancel': function (e,t) {
        e.preventDefault();
        $('[name=title]').val("");
	$('.ck-editor').val("");
        Session.set('pageId',null);
    },
    'click .editPage': function (e,t) {
        e.preventDefault();
        Session.set('pageId',this._id);
    }
});
