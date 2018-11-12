const express = require("express");
const router = express.Router();
const Yummly = require("ws-yummly");
const Randomizer = require("./recipe-randomizer");
const Random = new Randomizer();

Yummly.config({
  app_id: process.env.API_ID,
  app_key: process.env.API_KEY
});

router.post("/discover", (req, res, next) => {
  const userPref = req.user.preferences;

  const diets = userPref.diets ? userPref.diets : "";
  const cuisines =
    userPref.cuisines.length !== 0
      ? userPref.cuisines
      : Random.getRandomCuisine();
  const allergies = userPref.allergies ? userPref.allergies : "";
  const excludedCourses = "Desserts,Breads,Beverages,Condiments and Sauces,Cocktails".split(
    ","
  );
  const val = Yummly.query("pancakes")
    .maxTotalTimeInSeconds(1400)
    .maxResults(20)
    .allowedAllergies(["Egg"])
    .minRating(3)
    .getURL();
  console.log(val);
});

module.exports = router;
