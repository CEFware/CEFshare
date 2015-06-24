Template.adminMaillist.helpers({
    listMaillistMsgs: function() {
	var res=Maillist.find().fetch();
	if (res.length>0)
            return res;
    },
    curMsg: function () {
	var resId=Session.get('msgId');
	if (resId) {
	    var resMsg=Maillist.findOne({_id:resId});
	    if (resMsg) {
		return resMsg;
	    };
	};
	return false;
    },
    fType: function () {
	var resId=Session.get('msgId');
	if (resId)
	    return "update";
	return "insert";
    },
    formatDate: function (dat) {
        if (dat) {
            var res=new Date(dat);
            return res.toISOString().slice(0,10);
        };
    },
    ifEditing: function () {
	if (this._id===Session.get('msgId'))
	    return {class:"active"};
    },
    sent: function () {
	return this.status==='SENT';
    },
    pending: function () {
	return this.status==='PENDING';
    },
    wentOut: function () {
	if (this.reach)
	    return '#'+this.reach;
	return '...';
    },
    label: function (status) {
	switch (status) {
	    case 'PREPARED':
	    return 'primary';
	    break;
	    case 'PENDING':
	    return 'warning';
	    break;
	    case 'SENT':
	    return 'success';
	    break;
	    default:
	    break;
	};
    },
    numUsersNow: function () {
	return Session.get('numUsersNow');
    }
});

AutoForm.addHooks(['sendBroadcastMessage'],{
    onSuccess: function (){
        window.scrollTo(0,0);
	Session.set('msgId',this.docId);
        Materialize.toast(TAPi18n.__("Thank you!"),2000);
    }
});

Template.adminMaillist.events({
    'click .sendMsg': function (e,t) {
	e.preventDefault();
	//to all or to those who not received
	Meteor.call('sendBroadcastMsg',this._id,$('input:radio[name='+this._id+']:checked').val());
    },
    'click .delMsg': function (e,t) {
	e.preventDefault();
	if (Session.get('msgId')===this._id) {
	    $('[name=subject]').val("");
	   // $('.note-editable').text("");
	    Session.set('msgId',null);
	};
	Meteor.call('deleteBroadcastMsg',this._id);
    },
    'click .cancel': function (e,t) {
	e.preventDefault();
	$('[name=subject]').val("");
	//$('.note-editable').text("");
	Session.set('msgId',null);
    },
    'click .editMsg': function (e,t) {
	e.preventDefault();
	Session.set('msgId',this._id);
    }
});

Template.adminMaillist.onRendered(function () {
    Meteor.subscribe('maillist');
    Meteor.call('numUsersNow', function (e,r) {
	if (!e)
	    Session.set('numUsersNow',r);
    });
    if (!Session.get('msgId')) {
	$('[name=subject]').val("");
	$('.note-editable').text("");
    };


});
