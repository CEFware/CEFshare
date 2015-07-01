
/**
 * Created by piyushthapa on 6/17/15.
 */


Template.layout.events({
});

Template.layout.onCreated(function(){
    Session.set('sidebarMenu',{
        mobile:'sidebar_mobile_main',
        desktop:'sidebar_main_Desktop'
    });
});
Template.layout.helpers({
    getDesktopTemplate:function(){

        if(Session.get('sideBarMenu')) {
	    if (Router.current().url.indexOf('admin')>-1) {
		return "sidebar_admin_desktop";
	    } else {
		return Session.get('sideBarMenu').desktop;
	    };
	} else {
            Session.set('sideBarMenu',{
                mobile:'sidebar_mobile_main',
                desktop:'sidebar_main_Desktop'
            });
	    if (Router.current().url.indexOf('admin')>-1) {
 		return "sidebar_admin_desktop";
	    } else {
		return Session.get('sideBarMenu').desktop;
	    };
        }

    },
    filter: function () {
        if (Session.get('filter'))
            return true;
    }

});

Template.layout.onRendered(function(){
    $('select').material_select();
    $(".button-collapse").sideNav();
});
Template.searchOverlay.helpers({
    isSearching:function(){
        return Session.get('searching');
    }
});

Template.layout.events({
    'focus .search-top': function(){
        $('.overlay-contentscale').addClass('open');
        $('.content-wrapper').addClass('open');
        $('.search-top').focusout(function(){
            $('#search-field').focus();
        });
    },
    'focus #search': function () {

           Session.set('searching',true);

            $('#search_label').addClass('green-highlight');
            $('#closeSearch').addClass('green-highlight');

    },
    'click .button-collapse': function(e){
        Session.set('filter', false);
    },
    'click .btn-close':function(e){
        e.preventDefault();
        $('.overlay-contentscale').removeClass('open');
        $('.content-wrapper').removeClass('open');
    },
    'click .search-card a':function(e){
        $('.overlay-contentscale').removeClass('open');
        $('.content-wrapper').removeClass('open');
    }

});

Template.searchOverlay.events({
    'click .btn-close':function(e){
        e.preventDefault();
        $('.overlay-contentscale').removeClass('open');
        $('.content-wrapper').removeClass('open');
        Session.set('searching',null);
    },
    'click .search-card a':function(e){
        $('.overlay-contentscale').removeClass('open');
        $('.content-wrapper').removeClass('open');
    },
    'keyup #search-field':function(e){
        Session.set('searching',$('#search-field').val());
    }
});
