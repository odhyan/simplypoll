UI.registerHelper('pluralize', function(n, thing) { 
  // fairly stupid pluralizer
  if (n === 1) {
    return thing; 
  } else {
    return thing + 's'; 
  }
});