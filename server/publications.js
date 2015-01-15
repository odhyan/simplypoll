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