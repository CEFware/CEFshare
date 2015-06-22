Template.sidebar_main_Desktop.onRendered(function(){
	$('select#lang').material_select();
});

Template.sidebar_main_Desktop.events({
	'click .close-filter': function(e){
		e.preventDefault();
		Session.set('filter', false);
	}
});