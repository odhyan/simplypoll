Router.configure({ 
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

PollsListController = RouteController.extend({
  template: 'pollsList',
  increment: 5, 
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

Router.route('/submit', {
  name: 'pollSubmit'
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

Router.onBeforeAction(requireLogin, {only: 'pollSubmit'});