const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Favorites = require("../models/Favorites");
const UserFavorites = require("../models/UserFavorites");
/* GET home page */

router.post("/userfavorite", (req, res, next) => {
  Favorites.create({
    recipeName: req.body.recipeName,
    thumbnail: req.body.thumbnail,
    apiURL: req.body.apiURL
  }).then(fav => {
    UserFavorites.create({
      _user: req.user._id,
      _favorite: fav._id
    });
    res.json("Added to favourites");
  });
});

router.delete("/userFavoriteDelete", (req, res, next) => {
  Favorites.findOneAndDelete({ apiURL: req.body.apiURL })
    .then(deletedFav => {
      UserFavorites.findOneAndDelete({ _favorite: deletedFav._id })
        .then(() => {})
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

router.get("/:id", (req, res) => {
  Favorites.findByIdAndRemove(req.params.id)
    .then(deletedFav => {
      UserFavorites.findOneAndDelete({ _favorite: deletedFav._id })
        .then(() => {
          res.redirect("/account/favorites");
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

module.exports = router;
