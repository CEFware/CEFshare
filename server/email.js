Meteor.methods({

    sendEmail: function (doc) {
        this.unblock();

        check(doc, Schema.contact);

        var text = "From e-mail: " + doc.email + "\n\n\n\n"+ doc.message;

	var to=Meteor.settings.private.supportEmail;console.log(to);
	if (doc.toEmail)
	    to=doc.toEmail;

        return Email.send({
	    from: doc.email,
            to: to,
            subject: Meteor.settings.public.marketplaceName+" contact form from "+doc.email,
            text: text
        });
    },

    sendMaillist: function (to,subj,msg) {

	var from=Main.findOne();
	if (from && from.basics && from.basics.marketplaceEmail) {
	    from=from.basics.marketplaceEmail;
	} else {
	    from=Meteor.settings.private.supportEmail;
	};

        return Email.send({
	    from: from,
            to: to,
            subject: subj,
            text: msg
        });
    },

    newFollowerEmail: function (username) {

        var text = Meteor.user().username+' is now following you! Check your new follower profile here: '+Meteor.settings.public.url+'user/'+Meteor.user().username;

        this.unblock();

        return Email.send({
	    from: Meteor.settings.private.supportEmail,
            to: currentUserEmail({username:username}),
            subject: "You got new follower on "+Meteor.settings.public.marketplaceName+' ('+Meteor.settings.public.url+')',
            text: text
        });


    },

    sendVerEmail: function (){
        this.unblock();
        Accounts.sendVerificationEmail(Meteor.userId());
        return true;
    },

    dropPassword: function () {
        this.unblock();
        Accounts.sendResetPasswordEmail(Meteor.userId());
        return true;
    }
/*,
    testMail:function(){
        //tested now with mailgun this is not needed now email.send will send email from our mailgun credential
        console.log('sendingMail');
        this.unblock();
        return Email.send({
            to: 'piyushthapa74@gmail.com',
            subject: 'testing Email',
            text: 'just testing the email'
        });

    }
*/
});
