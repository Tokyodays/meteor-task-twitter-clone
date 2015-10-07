Tweets = new Mongo.Collection("tweets");

Tweets.allow({
  insert: function (userId, doc) {
    // the user must be logged in, and the document must be owned by the user
    return (userId && doc.owner === userId);
  },
  update: function (userId, doc, fields, modifier) {
    // can only change your own documents
    return doc.owner === userId;
  },
  remove: function (userId, doc) {
    // can only remove your own documents
    return doc.owner === userId;
  },
  fetch: ['owner']
});

Tweets.deny({
  update: function (userId, doc, fields, modifier) {
    // can't change owners
    return _.contains(fields, 'owner');
  },
  remove: function (userId, doc) {
    // can't remove locked documents
    return doc.locked;
  },
  fetch: ['locked'] // no need to fetch 'owner'
});

if (Meteor.isClient) {
  Template.hello.helpers({
    tweets: function(){
      return Tweets.find({});
    }
  });

  Template.hello.events({
    "submit .new-tweet": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var text = event.target.text.value;

      // Insert a tweet into the collection
      Tweets.insert({
        text: text,
        owner: Meteor.userId(),
        createdAt: new Date() // current time
      });

      // Clear form
      event.target.text.value = "";
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
