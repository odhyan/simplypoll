Template.leaderboard.helpers({
  topUsers: function() {
    var users = Meteor.users.find({}, {sort: {karma: -1}}).fetch();

    for(var i = 0; i < users.length; i++) {
      users[i].rank = i + 1;
      if(!users[i].karma) users[i].karma = 0;
    }

    return users;
  }
});