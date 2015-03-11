Emails = new Mongo.Collection('emails');

Images = new FS.Collection("images", {
    stores: [new FS.Store.FileSystem("images", {path: "~/listings"})]
});

