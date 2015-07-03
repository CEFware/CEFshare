Template.newsLetter.helpers({
    getNewsText: function () {
	var res=Main.findOne();
	if (res && res.instructions && res.instructions.subscribeInfo)
	    return res.instructions.subscribeInfo;
	return false;
    } 
});
