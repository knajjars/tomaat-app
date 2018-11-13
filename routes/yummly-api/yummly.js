const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../Secuirty/ensureAuthenticated");
const Yummly = require("./ws-yummly");
const RecipeToolset = require("./recipe-toolset");
const ToolSet = new RecipeToolset();
const MetaData = require("./metadata");

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
          res.render("recipes/discover", {
            recipe: recipe.matches[0],
            recipeImage: recipe.matches[0].imageUrlsBySize["90"].replace(
              "=s90-c",
              ""
            ),
            recipeTime: ToolSet.secondsToHms(
              recipe.matches[0].totalTimeInSeconds
            )
          });
        });
    });
});

router.get("/decide/:page", ensureAuthenticated, (req, res, next) => {
  //page the user is in
  let page = req.params.page;
  page !== 1 ? (page *= 15) : (page = 0);

  //get user preferences
  const diets = req.query.diet ? req.query.diet : "";
  const cuisines = req.query.cuisine ? req.query.cuisine : "";
  const allergies = req.query.allergy ? req.query.allergy : "";
  const query = req.query.query ? req.query.query : "";

  //get search values for metadata
  const dietSearchValue = MetaData.getSearchValue(diets, "diet");
  const cuisineSearchValue = MetaData.getSearchValue(cuisines, "cuisine");
  const allergySearchValue = MetaData.getSearchValue(allergies, "allergy");

  Yummly.query(query)
    .requirePictures(true)
    .start(page)
    .maxResults(15)
    .allowedCuisines(cuisineSearchValue)
    .allowedDiets(dietSearchValue)
    .allowedAllergies(allergySearchValue)
    .minRating(4)
    .get()
    .then(recipe => {
      recipe.matches.forEach(el => {
        el.recipeTime = ToolSet.secondsToHms(el.totalTimeInSeconds);
        el.imageURL = el.imageUrlsBySize["90"].replace("=s90-c", "");
      });
      const recipes = {
        matches: recipe.matches,
        totalMatchCount: ToolSet.numberWithCommas(recipe.totalMatchCount)
      };
      res.render("recipes/recipe-matches", { recipes });
    });
});

module.exports = router;
