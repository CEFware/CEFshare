Template.changeLang.events({
    'change' : function (event) {
        if (TAPi18n.getLanguage() != event.currentTarget.value) {
            TAPi18n.setLanguage(event.currentTarget.value);
        }
    }
});

Template.changeLang.helpers({
    languages : function() {
	var arrR=[];
	$.each(TAPi18n.getLanguages(),function (index,value) {
	    arrR.push({"code":index, "name":value.name, "selected":(TAPi18n.getLanguage()===index ? "selected" : "")});
	});
	return arrR;
    }
});


