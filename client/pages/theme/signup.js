/**
 * Created by piyushthapa on 7/7/15.
 */
Template.ourSignUp.onCreated(function(){
   this.showForm=new ReactiveVar(false);
});
Template.ourSignUp.helpers({
   showForm:function(){
       return Template.instance().showForm.get();
   }
});
Template.ourSignUp.events({
   'click #showForm':function(e){
       e.preventDefault();
       Template.instance().showForm.set(true);
   }
});