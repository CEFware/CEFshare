/**
 * Created by piyushthapa on 6/24/15.
 */
Template.sidebar_admin_desktop.events({
   'click .main-sidebar li a':function(e){
       e.preventDefault();
       var href=$(e.target).attr('href');
       $('.main-sidebar li').removeClass('active-sidebar');
       $(e.target).parent().addClass('active-sidebar');
       Router.go(href);
   }
});
Template.sidebar_admin_desktop.onRendered(function(){
   var loc=Iron.Location.get().path;
    $('a[href^="'+loc+'"]').parent().addClass('active-sidebar');
});