const hbs = require("hbs");
hbs.registerHelper("includes", function(v1, v2, options) {
  if (v1.includes(v2)) {
    return options.fn(this);
  }
  return options.inverse(this);
});
