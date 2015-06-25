/**
 * Created by piyushthapa on 6/25/15.
 */
Template.odersNew.onCreated(function(){
   this.subscribe('getUserOrders',Meteor.userId());
});
Template.odersNew.onRendered(function(){

});
Template.odersNew.helpers({
   getOders:function(){
       return Orders.find({owner:Meteor.userId()});
   }
});