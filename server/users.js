Accounts.onCreateUser(function(options, user) {
  user.profile = { 
    karma: 0
  };
  return user;
});