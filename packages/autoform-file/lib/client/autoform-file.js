var clearFilesFromSession, getCollection, getIcon, getTemplate, refreshFileInput;

AutoForm.addInputType('fileUpload', {
  template: 'afFileUpload'
});

refreshFileInput = function(name) {
  var callback;
  callback = function() {
    var value;
    value = $('input[name="' + name + '"]').val();
    return Session.set('fileUpload[' + name + ']', value);
  };
  return setTimeout(callback, 10);
};

getIcon = function(file) {
  var icon;
  if (file) {
    file = file.toLowerCase();
    icon = 'file-o';
    if (file.indexOf('youtube.com') > -1) {
      icon = 'youtube';
    } else if (file.indexOf('vimeo.com') > -1) {
      icon = 'vimeo-square';
    } else if (file.indexOf('.pdf') > -1) {
      icon = 'file-pdf-o';
    } else if (file.indexOf('.doc') > -1 || file.indexOf('.docx') > -1) {
      icon = 'file-word-o';
    } else if (file.indexOf('.ppt') > -1) {
      icon = 'file-powerpoint-o';
    } else if (file.indexOf('.avi') > -1 || file.indexOf('.mov') > -1 || file.indexOf('.mp4') > -1) {
      icon = 'file-movie-o';
    } else if (file.indexOf('.png') > -1 || file.indexOf('.jpg') > -1 || file.indexOf('.gif') > -1 || file.indexOf('.bmp') > -1 || file.indexOf('.ico') > -1) {
      icon = 'file-image-o';
    } else if (file.indexOf('http://') > -1 || file.indexOf('https://') > -1) {
      icon = 'link';
    }
    return icon;
  }
};

getTemplate = function(file) {
  var template;
  file = file.toLowerCase();
  template = 'fileThumbIcon';
  if (file.indexOf('.jpg') > -1 || file.indexOf('.png') > -1 || file.indexOf('.gif') > -1 || file.indexOf('.ico') > -1) {
    template = 'fileThumbImg';
  }
  return template;
};

clearFilesFromSession = function() {
  return _.each(Session.keys, function(value, key, index) {
    if (key.indexOf('fileUpload') > -1) {
      return Session.set(key, '');
    }
  });
};

getCollection = function(context) {
  if (typeof context.atts.collection === 'string') {
    context.atts.collection = FS._collections[context.atts.collection] || window[context.atts.collection];
  }
  return context.atts.collection;
};

AutoForm.addHooks(null, {
  onSuccess: function() {
    return clearFilesFromSession();
  }
});

Template.afFileUpload.destroyed = function() {
  var name;
  name = this.data.name;
  return Session.set('fileUpload[' + name + ']', null);
};

Template.afFileUpload.events({
  "change .file-upload": function(e, t) {
    var collection, files;
    files = e.target.files;

    return FS.Utility.eachFile(e, function (file) {
	var newFile = new FS.File(file);
	newFile.author=Meteor.userId();
	collection = getCollection(t.data);
	return collection.insert(newFile, function(err, fileObj) {
	    var name;
	    if (err) {
		return console.log(err);
	    } else {
		name = $(e.target).attr('file-input');
		$('input[name="' + name + '"]').val(fileObj._id);
		Session.set('fileUploadSelected[' + name + ']', newFile.name);
		return refreshFileInput(name);
	    }
	});
    });
  },
  'click .file-upload-clear': function(e, t) {
    var name;
    name = $(e.currentTarget).attr('file-input');
    $('input[name="' + name + '"]').val('');
    return Session.set('fileUpload[' + name + ']', 'delete-file');
  }
});

Template.afFileUpload.helpers({
  selectedImageId: function() {
    return Session.get('fileUpload[' + this.name + ']');
  },
  collection: function() {
    return getCollection(this);
  },
  label: function() {
    return this.atts.label || 'Choose file';
  },
  removeLabel: function() {
    return this.atts['remove-label'] || 'Remove';
  },
  fileUploadAtts: function() {
    var atts;
    atts = _.clone(this.atts);
    delete atts.collection;
    return atts;
  },
  fileUpload: function() {
    var af, collection, doc, file, filename, name, obj, parentData, src;
    af = Template.parentData(1)._af;
    name = this.atts.name;
    collection = getCollection(this);
    if (af && af.submitType === 'insert') {
      doc = af.doc;
    }
    parentData = Template.parentData(0).value || Template.parentData(4).value;
    if (Session.equals('fileUpload[' + name + ']', 'delete-file')) {
      return null;
    } else if (Session.get('fileUpload[' + name + ']')) {
      file = Session.get('fileUpload[' + name + ']');
    } else if (parentData) {
      file = parentData;
    } else {
      return null;
    }
    if (file !== '' && file) {
      if (file.length === 17) {
        if (collection.findOne({
          _id: file
        })) {
          filename = collection.findOne({
            _id: file
          }).name();
	    if (this.name==='desktopLogo') {
		src = collection.findOne({
		    _id: file
		}).url({
		    store: 'desktop'
		});
	    } else if (this.name==='socialLogo') {
		src = collection.findOne({
		    _id: file
		}).url({
		    store: 'social'
		});
	    } else if (this.name==='coverPhoto') {
		src = collection.findOne({
		    _id: file
		}).url({
		    store: 'thumb'
		});
	    } else if (this.name==='stillPhoto') {
		src = collection.findOne({
		    _id: file
		}).url({
		    store: 'thumb'
		});
	    } else if (this.name==='favicon') {
		src = collection.findOne({
		    _id: file
		}).url({
		    store: 'favicon'
		});
	    } else {
		src = collection.findOne({
		    _id: file
		}).url({
		    store: 'thumbs'
		});
	    };
        } else {
          filename = Session.get('fileUploadSelected[' + name + ']');
          obj = {
            template: 'fileThumbIcon',
            data: {
              src: filename,
              icon: getIcon(filename)
            }
          };
          return obj;
        }
      } else {
        filename = file;
        src = filename;
      }
    }
    if (filename) {
      obj = {
        template: getTemplate(filename),
        data: {
          src: src,
          icon: getIcon(filename)
        }
      };
      return obj;
    }
  },
  fileUploadSelected: function(name) {
    return Session.get('fileUploadSelected[' + name + ']');
  },
  isUploaded: function(name, collection) {
    var doc, file, isUploaded;
    file = Session.get('fileUpload[' + name + ']');
    isUploaded = false;
    if (file && file.length === 17) {
      doc = window[collection].findOne({
        _id: file
      });
      isUploaded = doc.isUploaded();
    } else {
      isUploaded = true;
    }
    return isUploaded;
  },
  getFileByName: function(name, collection) {
    var doc, file;
    file = Session.get('fileUpload[' + name + ']');
    if (file && file.length === 17) {
      doc = window[collection].findOne({
        _id: file
      });
      console.log(doc);
      return doc;
    } else {
      return null;
    }
  }
});
