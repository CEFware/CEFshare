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
    }
});
