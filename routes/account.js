const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const ensureAuthenticated = require("./Secuirty/ensureAuthenticated");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/", (req, res, next) => {
  res.render("account");
});
module.exports = router;
