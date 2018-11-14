const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../../models/User");
const UserFavorites = require("../../models/UserFavorites");
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

router.get("/settings", ensureAuthenticated, (req, res, next) => {
  res.render("account/settings");
});

router.post("/settings", ensureAuthenticated, (req, res, next) => {
  const { name, email } = req.body;
  if (name === req.user.name && email === req.user.email) {
    res.render("account/settings", { successMessage: "Changes saved!" });
  }
  if (name !== "" && email !== "") {
    if (email === req.user.email) {
      User.findByIdAndUpdate(req.user._id, {
        name
      })
        .then(user => {
          res.render("account/settings", {
            successMessage: `Name changed to ${user.name}`
          });
        })
        .catch(err => console.log(err));
    } else {
      User.findOne({ email: email })
        .then(user => {
          if (user !== null) {
            res.render("account/settings", {
              errorMessage: "E-mail already in use"
            });
          } else {
            User.findByIdAndUpdate(req.user._id, {
              email: email,
              name: name
            }).then(user => {
              res.render("account/settings", {
                successMessage: `E-mail changed to ${email} and name to ${name}`
              });
            });
          }
        })
        .catch(err => console.log(err));
    }
  } else {
    res.render("account/settings", {
      errorMessage: "Please indicate your e-mail and username"
    });
  }
});

router.get("/settings/password", ensureAuthenticated, (req, res, next) => {
  res.render("account/settings-password");
});

router.post("/settings/password", ensureAuthenticated, (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (oldPassword !== "" && newPassword !== "") {
    bcrypt.compare(oldPassword, req.user.password, (err, result) => {
      if (err || !result) {
        res.render("account/settings-password", {
          errorMessage: "Password is incorrect"
        });
      } else {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPassNew = bcrypt.hashSync(newPassword, salt);
        User.findByIdAndUpdate(req.user.id, {
          password: hashPassNew
        }).then(() =>
          res.render("account/settings-password", {
            successMessage: "Password changed!"
          })
        );
      }
    });
  } else {
    res.render("account/settings-password", {
      errorMessage: "Please enter both fields."
    });
  }
});

router.get("/favorites", (req, res) => {
  UserFavorites.find({ _user: req.user._id }).then(favorites => {
    console.log(favorites);
    if (favorites.length === 0) {
      res.render("account/favorites", { isEmpty: true });
    } else {
      res.render("account/favorites");
    }
  });
});

module.exports = router;
