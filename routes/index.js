const express = require('express');
const router  = express.Router();
const User = require("../models/User");


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

User.find()


module.exports = router;
