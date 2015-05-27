Meteor.methods({

    sendEmail: function (doc) {

        check(doc, Schema.contact);

        var text = "From e-mail: " + doc.email + "\n\n\n\n"+ doc.message;
        this.unblock();
        return Email.send({
	    from: doc.email,
            to: Meteor.settings.private.supportEmail,
            subject: Meteor.settings.public.marketplaceName+" contact form from "+doc.email,
            text: text
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
