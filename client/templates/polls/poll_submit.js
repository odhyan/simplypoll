Session.set('pollOptions', [_.random(0, 1000000), _.random(0, 1000000)]);

Template.pollSubmit.events({ 
	'submit form': function(e) {
	    e.preventDefault();
  		var title = $(e.target).find('[name=title]').val();
      var options = [];
      var i = 0;
      $(e.target).find('[name=option]').each(function() {
        var s = $(this).val();
        if(s.length) {
          options.push({
            id: 'o' + i,
            option: $(this).val()
          });
          i++;
        }
      });
      
      var poll = {
        title: title,
        options: options
      };
  		
  		var errors = validatePoll(poll);
  		if(errors.title || errors.url) {
  			return Session.set('pollSubmitErrors', errors);
  		}
		
	    Meteor.call('pollInsert', poll, function(error, result) {
	    	if(error) return throwError(error.reason);

	    	if(result.pollExists) throwError("This link has already been submitted");
	    	
	    	Router.go('pollPage', {_id: result._id});
	    });
  	},

    'click .add-option': function(e) {
      pollOptions = Session.get('pollOptions');
      pollOptions.push(_.random(0, 1000000));
      Session.set('pollOptions', pollOptions);
    },

    'click .delete-option': function(e) {
      var id = $(e.currentTarget).data('optionid');
      pollOptions = Session.get('pollOptions');
      pollOptions = _.without(pollOptions, id);
      Session.set('pollOptions', pollOptions);
    }
});

Template.pollSubmit.created = function() { 
	Session.set('pollSubmitErrors', {});
}

Template.pollSubmit.helpers({
  pollOptions: function() {
    return Session.get('pollOptions');
  },
	errorMessage: function(field) {
		return Session.get('pollSubmitErrors')[field]; 
	},
	errorClass: function (field) {
		return !!Session.get('pollSubmitErrors')[field] ? 'has-error' : '';
	} 
});