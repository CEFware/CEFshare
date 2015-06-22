Template.sidebar_mobile_main.onRendered(function(){
	$('#select-mob').material_select();
});
Template.sidebar_Wrapper_mobile.onCreated(function(){
   console.log(this.data());
});