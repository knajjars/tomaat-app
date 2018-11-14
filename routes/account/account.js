const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../../models/User");
const ensureAuthenticated = require("../Secuirty/ensureAuthenticated");
const MetaData = require("../yummly-api/metadata");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/preferences", ensureAuthenticated, (req, res, next) => {
  const values = {
    cuisine: MetaData.cuisine,
    allergy: MetaData.allergy,
    diet: MetaData.diet
  };
  res.render("account/preferences", {
    values
  });
});

router.get("/user-preferences", ensureAuthenticated, (req, res, next) => {
  res.json(req.user.preferences);
});

router.patch("/preferences", ensureAuthenticated, (req, res, next) => {
  const { cuisines, diets, allergies } = req.body.preferences;
  User.findByIdAndUpdate(req.user._id, {
    preferences: {
      cuisines,
      diets,
      allergies
    }
  }).then(user => res.json(user));
});

module.exports = router;
