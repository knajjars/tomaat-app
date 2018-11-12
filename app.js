require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");

mongoose
  .connect(
    "mongodb://localhost/food-app",
    { useNewUrlParser: true }
  )
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

hbs.registerHelper("ifUndefined", (value, options) => {
  if (arguments.length < 2)
    throw new Error("Handlebars Helper ifUndefined needs 1 parameter");
  if (typeof value !== undefined) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

// default value for title local
app.locals.title = "Tomaat";

// preferences collection
const cuisineObj = {};
cuisinesString =
  "American, Italian, Asian, Mexican, Southern & Soul Food, French, Southwestern, Barbecue, Indian, Chinese, Cajun & Creole, English, Mediterranean, Greek, Spanish, German, Thai, Moroccan, Irish, Japanese, Cuban, Hawaiin, Swedish, Hungarian, Portugese";

cuisinesString.split(", ").forEach(cuisine => {
  cuisineObj[cuisine] = null;
});

const allergyObj = {};
allergyString =
  "Dairy, Egg, Gluten, Peanut, Seafood, Sesame, Soy, Sulfite, Tree Nut, Wheat";
allergyString.split(", ").forEach(allergy => {
  allergyObj[allergy] = null;
});

const dietObj = {};
dietString = "Lacto vegetarian, Ovo vegetarian, Pescetarian, Vegan, Vegetarian";
dietString.split(", ").forEach(diet => {
  dietObj[diet] = null;
});

// Enable authentication using session + passport
app.use(
  session({
    secret: "irongenerator",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
app.use(flash());
require("./passport")(app);
app.use((req, res, next) => {
  if (req.user) {
    res.locals.loggedUser = req.user;
    req.user.preferences.cuisines.forEach(el => {
      delete cuisineObj[el];
    });
    req.user.preferences.allergies.forEach(el => {
      delete allergyObj[el];
    });
    req.user.preferences.diets.forEach(el => {
      delete dietObj[el];
    });
    app.locals.cuisine = Object.keys(cuisineObj);
    app.locals.allergy = Object.keys(allergyObj);
    app.locals.diet = Object.keys(dietObj);
  }
  next();
});

// console.log("DELETE DEBUG", cuisineObj);

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/yummly-api", require("./routes/yummly-api/yummly"));

module.exports = app;
