Router.configure({ 
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

PollsListController = RouteController.extend({
  template: 'pollsList',
  increment: 20, 
  pollsLimit: function() { 
    return parseInt(this.params.pollsLimit) || this.increment; 
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.pollsLimit()};
  },
  subscriptions: function() {
    this.pollsSub = Meteor.subscribe('polls', this.findOptions()); 
  },
  polls: function() {
    return Polls.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.polls().count() === this.pollsLimit();
    return {
      polls: this.polls(),
      ready: this.pollsSub.ready,
      nextPath: hasMore ? this.nextPath() : null
    };
  }
});

NewPollsController = PollsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPolls.path({pollsLimit: this.pollsLimit() + this.increment});
  }
});

TopPollsController = PollsListController.extend({
  sort: {voteCount: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.topPolls.path({pollsLimit: this.pollsLimit() + this.increment});
  }
});

Router.route('/', {
  name: 'home',
  controller: TopPollsController
});

Router.route('/new/:pollsLimit?', {
  name: 'newPolls'
});

Router.route('/top/:pollsLimit?', {
  name: 'topPolls'
});

Router.route('/polls/:_id', {
  name: 'pollPage',
  waitOn: function() {
    return [
      Meteor.subscribe('singlePoll', this.params._id)
    ];
  },
  data: function() {
    return Polls.findOne(this.params._id)
  }
});

Router.route('/user/:username', {
  name: 'userPage',
  waitOn: function() {
    return [
      Meteor.subscribe('singleUser', this.params.username),
      Meteor.subscribe('userPolls', this.params.username)
    ];
  },
  data: function() {
    return {
      user: Meteor.users.findOne({username: this.params.username}),
      polls: Polls.find({author: this.params.username})
    };
  }
});

Router.route('/leaderboard', {
  name: 'leaderboard',
  waitOn: function() {
    return Meteor.subscribe('topUsers');
  },
  data: function() {
    return Meteor.users.find({});
  }
});

Router.route('/submit', {
  name: 'pollSubmit'
});

Router.route('/admin', {
  name: 'admin'
});

var requireLogin = function() {
  if(!Meteor.user()) {
    if(Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
};

var requireAdminLogin = function() {
  if(Meteor.user() && Meteor.user().username == 'odhyan') {
    this.next();
  } else {
    if(Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  }
};

Router.onBeforeAction(requireLogin, {only: 'pollSubmit'});
Router.onBeforeAction(requireAdminLogin, {only: 'admin'});