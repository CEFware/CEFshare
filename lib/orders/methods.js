allUserOrders = function (userId) {
  return Orders.find({owner:this.userId});
};

orderById = function (id) {
    return Orders.find({idStripe:id});
};

allOrders = function () {
    if (Roles.userIsInRole(this.userId,'admin'))
	return Orders.find(); 
    return false;
};
