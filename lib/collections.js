Emails = new Mongo.Collection('emails');

var createSquareThumb = function(fileObj, readStream, writeStream) {
  var size = '255';
  gm(readStream).autoOrient().resize(size, size + '^').gravity('Center').extent(size, size).stream().pipe(writeStream);
};

var createSquareThumbSlider = function(fileObj, readStream, writeStream) {
  var size = '450';
  gm(readStream).autoOrient().resize(size, size + '^').gravity('Center').extent(size, size).stream().pipe(writeStream);
};

var createFavicon = function(fileObj, readStream, writeStream) {
  var size = '32';
  gm(readStream).setFormat('png').autoOrient().resize(size, size + '^').gravity('Center').extent(size, size).stream().pipe(writeStream);
};

var createDesktopLogo = function(fileObj, readStream, writeStream) {
  gm(readStream).autoOrient().resize('160', '51' + '^').gravity('Center').extent('160', '51').stream().pipe(writeStream);
};

var createSmallLogo = function(fileObj, readStream, writeStream) {
  gm(readStream).autoOrient().resize('50', '51' + '^').gravity('Center').extent('50', '51').stream().pipe(writeStream);
};

var createCover = function(fileObj, readStream, writeStream) {
  gm(readStream).autoOrient().resize('2500', '1667' + '^').gravity('Center').extent('2500', '1667').stream().pipe(writeStream);
};

var createStill = function(fileObj, readStream, writeStream) {
  gm(readStream).autoOrient().resize('2000', '1103' + '^').gravity('Center').extent('2000', '1103').stream().pipe(writeStream);
};

Images = new FS.Collection("images", {
    stores: [
	new FS.Store.FileSystem("images", {path: "~/listings"}),
	new FS.Store.FileSystem("thumbs", {transformWrite: createSquareThumb, path: "~/listings/thumbs"}),
	new FS.Store.FileSystem("slider", {transformWrite: createSquareThumbSlider, path: "~/listings/slider"})
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

Design = new FS.Collection("design", {
    stores: [
	new FS.Store.FileSystem("original", {path: "~/listings/design"}),
	new FS.Store.FileSystem("thumb", {transformWrite: createSquareThumb, path: "~/listings/design/thumb"}),
	new FS.Store.FileSystem("favicon", {transformWrite: createFavicon, path: "~/listings/design/favicon"}),
	new FS.Store.FileSystem("desktop", {transformWrite: createDesktopLogo, path: "~/listings/design/desktop"}),
	new FS.Store.FileSystem("social", {transformWrite: createSmallLogo, path: "~/listings/design/social"}),
	new FS.Store.FileSystem("cover", {transformWrite: createCover, path: "~/listings/design/cover"}),
	new FS.Store.FileSystem("still", {transformWrite: createStill, path: "~/listings/design/still"})
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

