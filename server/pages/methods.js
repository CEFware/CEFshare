Meteor.methods({
    deletePage: function (id) {
        if (Roles.userIsInRole(Meteor.userId(),'admin')) {
            var res=Pages.findOne({_id:id});
            Pages.remove({_id:id});
        };
    },
    makePageActive: function (id) {
        if (Roles.userIsInRole(Meteor.userId(),'admin')) {
            var res=Pages.findOne({_id:id._id});
	    var newRes=!id.active;
            Pages.update({_id:id._id}, {$set:{active:newRes}});
        };
    },
    deleteBlock: function (id) {
        if (Roles.userIsInRole(Meteor.userId(),'admin')) {
            var res=Blocks.findOne({_id:id});
            Blocks.remove({_id:id});
        };
    }
 });
