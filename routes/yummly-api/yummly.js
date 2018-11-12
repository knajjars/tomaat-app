const express = require("express");
const router = express.Router();
const Yummly = require("ws-yummly");

Yummly.config({
  app_id: process.env.API_ID,
  app_key: process.env.API_KEY
});

router.post("/something-new", (req, res, next) => {
  Yummly.query("pineapple")
    .maxTotalTimeInSeconds(1400)
    .maxResults(20)
    .allowedDiets(["Pescetarian", "Vegan"])
    .allowedCuisines(["asian"])
    .minRating(3)
    .get()
    .then(function(resp) {
      resp.matches.forEach(function(recipe) {
        console.log(recipe.recipeName);
      });
    });
});
module.exports = router;
