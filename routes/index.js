const express = require('express');
const router  = express.Router();
const User = require("../models/User");


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/yummly-api', (req,res,next)=>{

  cuisine = req.body.cuisine;
  allergy = req.body.allergy;
  diet = req.body.diet;
  res.render('index')
  console.log('CUISINE',cuisine)
  console.log('CUISINE',allergy)
  console.log('CUISINE',diet)
})


module.exports = router;
