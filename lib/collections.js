Emails = new Mongo.Collection('emails');

FiltersData = new Mongo.Collection('filtersData');

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

var mainPath="/tmp/"+Meteor.absoluteUrl().replace('http://','').split('.').shift().split(':').shift();

Images = new FS.Collection("images", {
    stores: [
	new FS.Store.FileSystem("images", {path: mainPath+"/listings"}),
	new FS.Store.FileSystem("thumbs", {transformWrite: createSquareThumb, path: mainPath+"/listings/thumbs"}),
	new FS.Store.FileSystem("slider", {transformWrite: createSquareThumbSlider, path: mainPath+"/listings/slider"})
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
	new FS.Store.FileSystem("original", {path: mainPath+"/listings/design"}),
	new FS.Store.FileSystem("thumb", {transformWrite: createSquareThumb, path: mainPath+"/listings/design/thumb"}),
	new FS.Store.FileSystem("favicon", {transformWrite: createFavicon, path: mainPath+"/listings/design/favicon"}),
	new FS.Store.FileSystem("desktop", {transformWrite: createDesktopLogo, path: mainPath+"/listings/design/desktop"}),
	new FS.Store.FileSystem("social", {transformWrite: createSmallLogo, path: mainPath+"/listings/design/social"}),
	new FS.Store.FileSystem("cover", {transformWrite: createCover, path: mainPath+"/listings/design/cover"}),
	new FS.Store.FileSystem("still", {transformWrite: createStill, path: mainPath+"/listings/design/still"})
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

Avatars = new FS.Collection("avatars", {
    stores: [
        new FS.Store.FileSystem("avatar", {transformWrite: createSquareThumb, path: mainPath+"/avatars"}),
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
