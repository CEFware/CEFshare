/**
 * Created by piyushthapa on 6/17/15.
 */
Template.header.onCreated(function(){

});
Template.header.helpers({
   getTemplate:function(){
       console.log(Session.get('sidebarMenu').mobile);
       return Session.get('sidebarMenu').mobile;
   }
});
Template.header.onRendered(function(){
    $('.button-collapse').sideNav();
});