Template.pollItem.helpers({
	ownPost: function() {
		return this.userId === Meteor.userId(); 
	}
});

Template.optionItem.events({
  'click .choose-option': function(e) {
    if(!Meteor.userId()) {
      alert("You are required to login to vote");
      return;
    }
    var pollId = $(e.target).data('pollid');
    var optionId = $(e.target).data('optionid');
    Meteor.call('vote', pollId, optionId, function() {
      console.log("voted");
    });
  }
});