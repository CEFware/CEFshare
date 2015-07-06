Meteor.publish('images', function(id){
    //publish only needed images - by providing it's list over id array

    if (id) {
        console.log(id);
        var imgs= Images.find({_id:{$in:id}});
        console.log(imgs.fetch());
        return imgs;
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
