UI.registerHelper('pluralize', function(n, thing) { 
  // fairly stupid pluralizer
  if (n === 1) {
    return thing; 
  } else {
    return thing + 's'; 
  }
});

UI.registerHelper('formatDate', function(date) {
  return moment(date).format('MMM D, YYYY');
});