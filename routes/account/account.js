const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const UserFavorites = require("../../models/UserFavorites");
const ShoppingCart = require("../../models/ShoppingCart");

const Yummly = require("../yummly-api/ws-yummly");
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

router.get("/favorites", ensureAuthenticated, (req, res) => {
  UserFavorites.find({ _user: req.user._id })
    .populate("_favorite")
    .then(favorites => {
      if (favorites.length === 0) {
        res.render("account/favorites", { isEmpty: true });
      } else {
        res.render("account/favorites", { favorites });
      }
    })
    .catch(err => console.log(err));
});

router.get("/shopping-cart", ensureAuthenticated, (req, res) => {
  ShoppingCart.find({ _user: req.user._id })
    .then(shoppingCart => {
      res.render("account/shopping-cart", { shoppingCart });
    })
    .catch(err => console.log(err));
});

router.get("/shopping-cart/:recipeId", ensureAuthenticated, (req, res) => {
  Yummly.getDetails(req.params.recipeId).then(recipe => {
    ShoppingCart.find({ _user: req.user._id }).then(currentShoppingCart => {
      const currentRecipeIds = currentShoppingCart.map(el => {
        return el.recipeId;
      });
      if (currentRecipeIds.includes(recipe[0].id)) {
        ShoppingCart.find({ _user: req.user._id }).then(shoppingCart => {
          res.render("account/shopping-cart", {
            message: "Recipe already in cart!",
            shoppingCart
          });
        });
      } else {
        ShoppingCart.create({
          ingredients: [...new Set(recipe[0].ingredientLines)],
          recipeName: recipe[0].name,
          recipeId: recipe[0].id,
          _user: req.user._id
        })
          .then(cart => {
            ShoppingCart.find({ _user: req.user._id }).then(shoppingCart => {
              res.render("account/shopping-cart", {
                message: "Recipe added!",
                shoppingCart
              });
            });
          })
          .catch(err => console.log(err));
      }
    });
  });
});

router.patch("/shopping-cart", ensureAuthenticated, (req, res, next) => {
  const { recipeId, ingredient } = req.body;
  ShoppingCart.find({ _user: req.user._id }).then(shoppingCart => {
    const targetCart = shoppingCart.filter(cart => {
      if (cart.recipeId === recipeId) {
        return cart;
      }
    });
    let ingredientsList = targetCart[0].ingredients;
    let updatedIngredients = ingredientsList.filter(item => {
      if (item !== ingredient) {
        return item;
      }
    });
    if (updatedIngredients.length > 0) {
      ShoppingCart.findByIdAndUpdate(targetCart[0]._id, {
        ingredients: updatedIngredients
      })
        .then(response => {
          next();
        })
        .catch(err => console.log(err));
    } else {
      ShoppingCart.findByIdAndDelete(targetCart[0].id)
        .then(() => {
          next();
        })
        .catch(err => console.log(err));
    }
  });
});

module.exports = router;
