Pages = new Mongo.Collection('pages');
Blocks = new Mongo.Collection('blocks');

pagesSchema = new SimpleSchema({
    title: {
        type: String,
        label: function () {
            return TAPi18n.__('Title')
        }
    },
    url: {
        type: String,
        optional: true,
        label: function () {
            return TAPi18n.__('URL')
        },
	custom: function () {
	    if ((typeof this.field("page").value==="undefined") && (typeof this.value==="undefined"))
		return "required"
	}
    },
    uri: {
        type: String,
	autoValue: function () {
	    if (this.isInsert) {

		var newUri=convertToSlug(this.field("title").value);
		var lastUri=newUri;

		var c=1;
		while (Pages.find({uri:newUri}).fetch().length>0) {
                    var newUri=lastUri+c;
                    c++;
		};

		return newUri;
	    };
	}
    },
    active: {
        type: Boolean,
        autoform: {
            defaultValue: true
        },
        label: function () {
            return TAPi18n.__('Show this item in Menu')
        }
    },
    page: {
        type: String,
        optional: true,
        label: function () {
            return TAPi18n.__('Item text')
        },
        autoform: {
            afFieldInput: {
                type: 'textarea',
                class: 'ck-editor'
            }
        },
	custom: function () {
	    if ((typeof this.field("url").value==="undefined") && (typeof this.value==="undefined"))
		return "required"
	}
    }
});

blocksSchema = new SimpleSchema({
    title: {
        type: String,
        label: function () {
            return TAPi18n.__('Title')
        }
    },
    uri: {
        type: String,
	autoValue: function () {
	    if (this.isInsert) {

		var newUri=convertToSlug(this.field("title").value);
		var lastUri=newUri;

		var c=1;
		while (Blocks.find({uri:newUri}).fetch().length>0) {
                    var newUri=lastUri+c;
                    c++;
		};

		return newUri;
	    };
	}
    },
    page: {
        type: String,
        label: function () {
            return TAPi18n.__('Block text')
        },
        autoform: {
            afFieldInput: {
                type: 'textarea',
                class: 'ck-editor'
            }
        }
    }
});
Pages.attachSchema(pagesSchema);
Blocks.attachSchema(blocksSchema);
