allUserInvoices = function () {
  return Invoices.find({owner:this.userId});
}

invoiceById = function (id) {
    return Invoices.find({idStripe:id});
}

allInvoices = function () {
    if (Roles.userIsInRole(this.userId,'admin'))
	return Invoices.find(); 
    return false;
}
