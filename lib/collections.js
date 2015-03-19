Emails = new Mongo.Collection('emails');

var createSquareThumb = function(fileObj, readStream, writeStream) {
  var size = '255';
  gm(readStream).autoOrient().resize(size, size + '^').gravity('Center').extent(size, size).stream().pipe(writeStream);
};

Images = new FS.Collection("images", {
    stores: [
	new FS.Store.FileSystem("images", {path: "~/listings"}),
	new FS.Store.FileSystem("thumbs", {transformWrite: createSquareThumb, path: "~/listings/thumbs"})
    ],
    filter: {
	maxSize: 5242880,
	allow: {
	    contentTypes: ['image/*']
	},
	deny: {
	    extensions: ['gif']
	},
	onInvalid: function (message) {
	    if (Meteor.isClient) {
		alert(message);
	    } else {
		console.log(message);
	    };
	}
    }
});

