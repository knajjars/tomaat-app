const express = require('express');
const router  = express.Router();
const User = require("../models/User");
const Favorites = require("../models/Favorites")

/* GET home page */

router.post('/userfavorite', (req,res,next)=>{
  Favorites.create(
    {
      recipeName: req.body.recipeName,
      cuisine: req.body.cuisine,
      thumbnail: req.body.thumbnail,
      apiURL: req.body.apiURL,
    })
  .then(fav=>{
    console.log('fav',fav);
    res.json("Added to favourites")
  })
})

module.exports = router;
