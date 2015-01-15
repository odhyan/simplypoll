Polls = new Meteor.Collection('polls');

Meteor.methods({
  pollInsert: function(pollAttributes) {
    check(Meteor.userId(), String);
    check(pollAttributes, {
      title: String,
      options: Array
    });

    var options = pollAttributes.options;
    var votes = {};
    for(var i = 0; i < options.length; i++) {
      votes[options[i].id] = 0;
    }

    var errors = validatePoll(pollAttributes); 
    if (errors.title || errors.options)
      throw new Meteor.Error('invalid-poll', "You must set title and options for your poll");

    var user = Meteor.user();
    var poll = _.extend(pollAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      voters: [],
      votes: votes,
      voteCount: 0
    });

    var pollId = Polls.insert(poll);

    return {
      _id: pollId
    };
  },

  pollDelete: function(pollId) {
    Polls.remove(pollId);
  },

  vote: function(pollId, optionId) { 
    check(this.userId, String); 
    check(pollId, String);
    check(optionId, String);

    var ud = { $inc: {} };
    ud.$inc['votes.' + optionId] = 1;
    ud.$inc['voteCount'] = 1;
    ud.$addToSet = {voters: this.userId};
    
    var affected = Polls.update({
      _id: pollId,
      voters: {$ne: this.userId}
    }, ud);

    if(!affected) throw new Meteor.Error('invalid', "You weren't able to vote for this poll");
  }
});

validatePoll = function(poll) {
  var errors = {};
  if (!poll.title)
    errors.title = "Please fill in a title";
  if (!poll.options)
    errors.options = "Please fill in the options";
  return errors;
};