/**
 * Created by piyushthapa on 6/17/15.
 */
Template.header.onCreated(function(){

});
Template.header.helpers({
   getTemplate:function(){
       console.log(Session.get('sidebarMenu').mobile);
       if (Router.current().url.indexOf('admin')>-1) {
           return "sidebar_admin_desktop";
       } else {
	   return Session.get('sidebarMenu').mobile;
       };
    }
});
Template.header.onRendered(function(){
    $('.button-collapse').sideNav();
});
