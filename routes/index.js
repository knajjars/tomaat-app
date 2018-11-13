const express = require('express');
const router  = express.Router();
const User = require("../models/User");


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/users', (req,res,next)=>{
  User.findOne(req.user)
  .then(user=>{
    console.log('user',user);
    res.render(user.data)
  })
})

module.exports = router;
