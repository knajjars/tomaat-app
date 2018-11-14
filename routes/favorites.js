const express = require('express');
const router  = express.Router();
const User = require("../models/User");
const Favorites = require("../models/Favorites")
const UserFavorites = require("../models/UserFavorites")
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
    UserFavorites.create(
      {
        _user: req.user._id,
        _favorite: fav._id,
      }
    )
    console.log('fav',fav);
    res.json("Added to favourites")
  })
})

router.delete('/userFavoriteDelete', (req,res,next)=>{
  console.log('APIURL', req.data.apiURL);
  
  Favorites.deleteOne(
    {
      apiURL: req.body.apiURL
    }
  )
  .then(deletedFav =>{
    console.log('DELETED',deletedFav);
    
  })
})


module.exports = router;
