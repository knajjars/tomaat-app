const hbs = require("hbs");
hbs.registerHelper("ifCond", function(v1, v2, options) {
  console.log("inside hbs config", v1);
  if (v1.includes(v2)) {
    return options.fn(this);
  }

  return options.inverse(this);
});
