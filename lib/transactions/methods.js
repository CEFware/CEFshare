allUserTransactions = function () {
  return Orders.find({'items.product.author':this.userId});
}
