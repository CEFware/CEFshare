Maillist = new Mongo.Collection('maillist');

inviteSchema = new SimpleSchema({
    emails: {
	type: String
    },
    message: {
	type: String
    }
});

maillistSchema = new SimpleSchema({
    subject: {
	type: String,
    },
    message: {
	type: String,
        autoform: {
            afFieldInput: {
                type: 'summernote',
                class: 'editor',
                height:300,
                toolbar: [
                    ['style', ['bold', 'italic', 'underline', 'clear']],
                    ['font', ['strikethrough']],
                    ['para', ['ul', 'ol']],
                    ['insert', ['hr']],
                    ['misc', ['fullscreen', 'codeview','undo','redo']],
                ]
            }
        }
     },
    status: {
	type: String,
    },
    reach: {
	type: Number,
        autoValue: function() {
            return Meteor.users.find().count();
        }
    },
    author: {
        type: String,
        autoValue: function() {
            return Meteor.userId();
        }
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date;
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date};
            } else {
                this.unset();
            }
        }
    }

});

Maillist.attachSchema(maillistSchema);
