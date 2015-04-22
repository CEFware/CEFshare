Template.adminTransactions.helpers({
    listAllOrders: function () {
        return Orders.find();
    },
    startedDate: function () {
        if (this.createdAt) {
            var res=new Date(this.createdAt);
            return res.toISOString().slice(0,10);
        };
    }
});

Template.adminTransactions.rendered = function () {
    Tracker.autorun(function(){
        Meteor.subscribe('adminOrdersList');
    });
};
