Meteor.publish('images', function(id){
    //publish only needed images - by providing it's list over id array
    if (id) {
        return Images.find({_id:{$in:id}});
    } else {
        return Images.find();
    };
});
