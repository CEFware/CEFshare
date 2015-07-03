Template.sidebar_main_Desktop.onRendered(function(){
	$('select#lang').material_select();
});

Template.sidebar_main_Desktop.events({
    'click .close-filter': function(e){
	e.preventDefault();
	Session.set('filter', false);
    },
    'change #languages': function (event) {
	if (TAPi18n.getLanguage() != event.currentTarget.value) {
            TAPi18n.setLanguage(event.currentTarget.value);
	};
    }
});

Template.sidebar_main_Desktop.helpers({
    languages : function() {
	var arrR=[];
	$.each(TAPi18n.getLanguages(),function (index,value) {
	    arrR.push({"code":index, "name":value.name, "selected":(TAPi18n.getLanguage()===index ? "selected" : "")});
	});
	return arrR;
    },
    pages: function () {
	return Pages.find();
    },
    fb:function () {
	var res=Main.findOne();
	if (res && res.socialAccounts && res.socialAccounts.fbHandle)
	        return res.socialAccounts.fbHandle;
	return false;
    },
    tw:function () {
	var res=Main.findOne();
	if (res && res.socialAccounts && res.socialAccounts.twitterHandle)
	        return res.socialAccounts.twitterHandle;
	return false;
    },
    google:function () {
	var res=Main.findOne();
	if (res && res.socialAccounts && res.socialAccounts.googleHandle)
	        return res.socialAccounts.googleHandle;
	return false;
    },
    social: function () {
	var res=Main.findOne();
	if (res && res.socialAccounts && (res.socialAccounts.fbHandle || res.socialAccounts.twitterHandle || res.socialAccounts.googleHandle))
	        return true;
	return false;
    }
});
