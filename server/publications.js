Meteor.publish('polls', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Polls.find({}, options);
});

Meteor.publish('singlePoll', function(id) {
  check(id, String);
  return Polls.find(id);
});

Meteor.publish('singleUser', function(username) {
  check(username, String);
  return Meteor.users.find({username: username}, {
    fields: {
      username: 1,
      karma: 1
    }
  });
});