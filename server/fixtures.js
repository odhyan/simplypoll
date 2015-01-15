// Fixture data 
if (Polls.find().count() === 0) {
  var now = new Date().getTime();

  // create two users
  var uid1 = Meteor.users.insert({
    username: 'joey'
  });
  var user1 = Meteor.users.findOne(uid1);
  var uid2 = Meteor.users.insert({
    username: 'shania'
  });
  var user2 = Meteor.users.findOne(uid2);
  
  var pollId = Polls.insert({
    title: 'Which is your favorite color?',
    options: [
      {id: 'o0', option: "Red", votes: 0},
      {id: 'o1', option: "Blue", votes: 0},
      {id: 'o2', option: "Green", votes: 0},
      {id: 'o3', option: "Black", votes: 0},
      {id: 'o4', option: "White", votes: 0},
      {id: 'o5', option: "Other", votes: 0}
    ],
    userId: user1._id,
    author: user1.username,
    submitted: new Date(now - 7 * 3600 * 1000),
    voters: [],
    votes: {
      'o0': 0,
      'o1': 0,
      'o2': 0,
      'o3': 0,
      'o4': 0,
      'o5': 0
    },
    voteCount: 0
  });

  var pollId = Polls.insert({
    title: 'Windows vs Mac vs Linux',
    options: [
      {id: 'o0', option: 'Windows', votes: 0},
      {id: 'o1', option: 'Mac', votes: 0},
      {id: 'o2', option: 'Linux', votes: 0}
    ],
    userId: user2._id,
    author: user2.username,
    submitted: new Date(now - 6 * 3600 * 1000),
    voters: [],
    votes: {
      'o0': 0,
      'o1': 0,
      'o2': 0
    },
    voteCount: 0
  });

}