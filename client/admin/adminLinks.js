Template.adminLinks.helpers({
    pagesSchemaObj: function() {
        return pagesSchema;
    },
    pages: function() {
        var res=Pages.find();
        if (res)
            return res;
    },
    ifEditingPage: function () {
        if (this._id===Session.get('pageId'))
            return {class:"active"};
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
		$('.ck-editor').val(resPage.page);
                return resPage;
            };
        };
        return false;
    },

    ifEditingBlock: function () {
        if (this._id===Session.get('blockId'))
            return {class:"active"};
    },
    blocks: function() {
        var res=Blocks.find();
        if (res)
            return res;
    },
    blocksSchemaObj: function() {
        return blocksSchema;
    },
    bType: function () {
        var resId=Session.get('blockId');
        if (resId)
            return "update";
        return "insert";
    },
    curBlock: function () {
        var resId=Session.get('blockId');
        if (resId) {
            var resPage=Blocks.findOne({_id:resId});
            if (resPage) {
		$('.ck-editor2').val(resPage.page);
                return resPage;
            };
        };
        return false;
    }
});

AutoForm.addHooks(['adminLinks','adminLinksBlocks'],{
    onSuccess: function (){
        Flash.success(1,TAPi18n.__("Thank you!"),2000);
    }
});

Template.adminLinks.rendered = function () {
    Meteor.subscribe('appSettings');
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
    'click .makeActive': function (e,t) {
        e.preventDefault();
        Meteor.call('makePageActive',this);
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
    },

    'click .delBlock': function (e,t) {
        e.preventDefault();
        if (Session.get('blockId')===this._id) {
            $('[name=title]').val("");
            Session.set('blockId',null);
        };
        Meteor.call('deleteBlock',this._id);
    },
    'click .cancelBlock': function (e,t) {
        e.preventDefault();
        $('[name=title]').val("");
	$('.ck-editor2').val("");
        Session.set('blockId',null);
    },
    'click .editBlock': function (e,t) {
        e.preventDefault();
        Session.set('blockId',this._id);
    }
});
