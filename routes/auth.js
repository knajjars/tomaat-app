const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const ensureAuthenticated = require("./Secuirty/ensureAuthenticated");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { name, password, email } = req.body;
  if (name === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate all the fields" });
    return;
  }

  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create({
      name,
      password: hashPass,
      email
    })
      .then(user => {
        req.login(user, function(err) {
          if (err) {
            return res.redirect("/auth/signup");
          }
          return res.redirect("/auth/preferences");
        });
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

router.get("/preferences", ensureAuthenticated, (req, res) => {
  res.render("auth/preferences");
});

router.post("/preferences", ensureAuthenticated, (req, res) => {
  const cuisinesString = "American, Italian, Asian, Mexican, Southern & Soul Food, French, Southwestern, Barbecue, Indian, Chinese, Cajun & Creole, English, Mediterranean, Greek, Spanish, German, Thai, Moroccan, Irish, Japanese, Cuban, Hawaiin, Swedish, Hungarian, Portugese".split(
    ","
  );
  const cuisinesArray = cuisinesString.map(cuisine => {
    return cuisine.trim();
  });
  const { cuisines } = req.body.preferences;
  const filteredCuisines = cuisines.filter(el => {
    if (cuisinesArray.includes(el)) {
      return el;
    }
  });

  const allergiesString = "Dairy, Egg, Gluten, Peanut, Seafood, Sesame, Soy, Sulfite, Tree Nut, Wheat".split(
    ","
  );
  const allergiesArray = allergiesString.map(allergy => {
    return allergy.trim();
  });
  const { allergies } = req.body.preferences;
  const filteredAllergies = allergies.filter(el => {
    if (allergiesArray.includes(el)) {
      return el;
    }
  });

  const dietsString = "Lacto vegetarian, Ovo vegetarian, Pescetarian, Vegan, Vegetarian".split(
    ","
  );
  const dietsArray = dietsString.map(diet => {
    return diet.trim();
  });
  const { diets } = req.body.preferences;
  const filteredDiets = diets.filter(el => {
    if (dietsArray.includes(el)) {
      return el;
    }
  });
  User.findByIdAndUpdate(req.user._id, {
    preferences: {
      cuisines: filteredCuisines,
      diets: filteredDiets,
      allergies: filteredAllergies
    }
  }).then(user => {
    res.redirect("/");
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
