Meteor.publish('images', function(id){
    //publish only needed images - by providing it's list over id array
    if (id) {
        return Images.find({_id:{$in:id}});
    } else {
        return Images.find();
    };
});

Meteor.publish('design', function(id){
    //publish only needed images - by providing it's list over id array
    if (id) {
        return Design.find({_id:{$in:id}});
    } else {
        return Design.find();
    };
});

Meteor.publish('avatars', function(id){
    //publish only needed images - by providing it's list over id array
    if (id) {
        return Avatars.find({_id:{$in:id}});
    } else {
        return Avatars.find();
    };
});
