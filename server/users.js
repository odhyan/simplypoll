Accounts.onCreateUser(function(options, user) {
  user.karma = 0;
  return user;
});