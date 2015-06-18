Template.footer.helpers({
    fb:function () {
	var res=Main.findOne();
	if (res && res.socialAccounts && res.socialAccounts.fbHandle)
	    return res.socialAccounts.fbHandle;
	return false;
    },
    tw:function () {
	var res=Main.findOne();
	if (res && res.socialAccounts && res.socialAccounts.twitterHandle)
	    return res.socialAccounts.twitterHandle;
	return false;
    },
    google:function () {
	var res=Main.findOne();
	if (res && res.socialAccounts && res.socialAccounts.googleHandle)
	    return res.socialAccounts.googleHandle;
	return false;
    },
    social: function () {
	var res=Main.findOne();
	if (res && res.socialAccounts && (res.socialAccounts.fbHandle || res.socialAccounts.twitterHandle || res.socialAccounts.googleHandle))
	    return true;
	return false;
    },
    address: function (key) {
	var res=Main.findOne();
	if (res && res.basics && res.basics.realAddress && res.basics.realAddress[key])
	    return res.basics.realAddress[key];
	return false;
    },
    getNewsText: function () {
	var res=Main.findOne();
	if (res && res.instructions && res.instructions.subscribeInfo)
	    return res.instructions.subscribeInfo;
	return false;
    } 
});
