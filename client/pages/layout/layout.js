
/**
 * Created by piyushthapa on 6/17/15.
 */


Template.layout.onCreated(function(){
    Session.set('sidebarMenu',{
        mobile:'sidebar_mobile_main',
        desktop:'sidebar_main_Desktop'
    });
});
Template.layout.helpers({
    getDesktopTemplate:function(){

        if(Session.get('sideBarMenu'))
            return Session.get('sideBarMenu').desktop;
        else{

            Session.set('sideBarMenu',{
                mobile:'sidebar_mobile_main',
                desktop:'sidebar_main_Desktop'
            });
            return Session.get('sideBarMenu').desktop;
        }

    }
});
Template.layout.onRendered(function(){
   $('select').material_select();
});
Template.layout.events({
    'focus .search-top': function(){
        $('.overlay-contentscale').addClass('open');
        $('.content-wrapper').addClass('open');
        $('.search-top').focusout(function(){
            $('#search-field').focus();
        });
    }

});
Template.searchOverlay.events({
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