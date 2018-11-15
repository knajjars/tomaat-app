const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../Secuirty/ensureAuthenticated");
const Yummly = require("./ws-yummly");
const RecipeToolset = require("./recipe-toolset");
const ToolSet = new RecipeToolset();
const MetaData = require("./metadata");
const UserFavorites = require("../../models/UserFavorites");

Yummly.config({
  app_id: process.env.API_ID,
  app_key: process.env.API_KEY
});

router.get("/discover", ensureAuthenticated, (req, res, next) => {
  //get user preferences
  const userPref = req.user.preferences;
  const diets = userPref.diets ? userPref.diets : "";
  const cuisines =
    userPref.cuisines.length !== 0
      ? userPref.cuisines
      : ToolSet.getRandomCuisine();
  const allergies = userPref.allergies ? userPref.allergies : "";

  //get search values for metadata
  const dietSearchValue = MetaData.getSearchValue(diets, "diet");
  const cuisineSearchValue = MetaData.getSearchValue(cuisines, "cuisine");
  const allergySearchValue = MetaData.getSearchValue(allergies, "allergy");

  Yummly.query("")
    .requirePictures(true)
    .maxResults(1)
    .allowedDiets(dietSearchValue)
    .allowedCuisines(cuisineSearchValue)
    .allowedAllergies(allergySearchValue)
    .minRating(4)
    .get()
    .then(results => {
      const totalMatchCount = results.totalMatchCount;
      Yummly.query("")
        .requirePictures(true)
        .maxResults(1)
        .start(ToolSet.getRandomIndex(totalMatchCount))
        .allowedDiets(dietSearchValue)
        .allowedCuisines(cuisineSearchValue)
        .allowedAllergies(allergySearchValue)
        .minRating(4)
        .get()
        .then(recipe => {
          UserFavorites.find({ _user: req.user._id })
            .populate("_favorite")
            .then(favorites => {
              let userFavorites = [];
              favorites.forEach(el => {
                userFavorites.push(el._favorite.apiURL);
              });
              const recipeId = recipe.matches[0].id;
              Yummly.getDetails(recipeId).then(recipe => {
                const recipeImage = recipe[0].images[0].imageUrlsBySize["360"];
                const item = {
                  recipe: recipe[0],
                  recipeImage,
                  discover: true
                };
                const values = {
                  item,
                  userFavorites
                };
                res.render("recipes/recipe-details", values);
              });
            });
        });
    });
});

router.get("/decide/:page", ensureAuthenticated, (req, res, next) => {
  //page the user is in
  let page = req.params.page;
  page !== 1 ? (page *= 30) : (page = 0);

  //get user preferences
  const diets = req.query.diet ? req.query.diet : "";
  const cuisines = req.query.cuisine ? req.query.cuisine : "";
  const allergies = req.query.allergy ? req.query.allergy : "";
  const query = req.query.query ? req.query.query : "";

  //get search values for metadata
  const dietSearchValue = MetaData.getSearchValue(diets, "diet");
  const cuisineSearchValue = MetaData.getSearchValue(cuisines, "cuisine");
  const allergySearchValue = MetaData.getSearchValue(allergies, "allergy");

  const userFavPromise = UserFavorites.find({ _user: req.user._id })
    .populate("_favorite")
    .then(favorites => {
      let userFavorites = [];
      favorites.forEach(el => {
        userFavorites.push(el._favorite.apiURL);
      });
      return userFavorites;
    });
  const yummlyPromise = Yummly.query(query)
    .requirePictures(true)
    .start(page)
    .maxResults(30)
    .allowedCuisines(cuisineSearchValue)
    .allowedDiets(dietSearchValue)
    .allowedAllergies(allergySearchValue)
    .minRating(4)
    .get()
    .then(recipe => {
      const totalMatchCount =
        recipe.matches.length > 0
          ? ToolSet.numberWithCommas(recipe.totalMatchCount)
          : 0;
      recipe.matches.forEach(el => {
        el.recipeTime = ToolSet.secondsToHms(el.totalTimeInSeconds);
        el.imageURL = el.imageUrlsBySize["90"].replace("=s90-c", "");
      });
      return {
        matches: recipe.matches,
        totalMatchCount
      };
    });

  Promise.all([userFavPromise, yummlyPromise]).then(responses => {
    const userFavorites = responses[0] ? responses[0] : [];
    res.render("recipes/recipe-matches", {
      recipes: responses[1],
      userFavorites: userFavorites
    });
  });
});

router.get("/recipe/:id", ensureAuthenticated, (req, res) => {
  const recipeId = req.params.id;
  const userFavPromise = UserFavorites.find({ _user: req.user._id })
    .populate("_favorite")
    .then(favorites => {
      let userFavorites = [];
      favorites.forEach(el => {
        userFavorites.push(el._favorite.apiURL);
      });
      return userFavorites;
    });
  const getDetailsPromise = Yummly.getDetails(recipeId)
    .then(recipe => {
      const recipeImage = recipe[0].images[0].imageUrlsBySize["360"];
      return {
        recipe: recipe[0],
        recipeImage,
        discover: false
      };
    })
    .catch(err => console.log(err));
  Promise.all([userFavPromise, getDetailsPromise])
    .then(responses => {
      const values = {
        item: responses[1],
        userFavorites: responses[0]
      };
      res.render("recipes/recipe-details", values);
    })
    .catch(err => console.log(err));
});

module.exports = router;
