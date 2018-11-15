const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const ensureAuthenticated = require("./Secuirty/ensureAuthenticated");
const metaData = require("./yummly-api/metadata");
const nodemailer = require("nodemailer");
const mailTemplate = require("../templates/template");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { name, password, email } = req.body;
  if (name === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate all the fields" });
    return;
  }

  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.NODEMAIL_EMAIL,
        pass: process.env.NODEMAIL_PASS
      }
    });

    String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.replace(new RegExp(search, "g"), replacement);
    };

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashEmail = bcrypt.hashSync(email, salt).replaceAll("/", email);
    const image = "public/images/speculative/happy-tomaat.png";
    const admin = 'info.tomaat@gmail.com'
    User.create({
      name,
      password: hashPass,
      email,
      confirmationCode: hashEmail
    })
      .then(user => {
        req.login(user, function(err) {
          console.log("WORKING");
          return res.redirect("/auth/preferences");
        });
      })
      .then(() => {
        transporter.sendMail({
          from: '"Tomaat" 🍅 <no_reply@tomaat.com>',
          to: email,
          subject: "You need to authorise your account",
          text: "Click this",
          html: mailTemplate.mailTemplate(
            "http://tomaat-app.herokuapp.com/auth/confirm/" + hashEmail
          )
        })
      })
      .then(() => {
        transporter.sendMail({
          from: '"Tomaat" 🍅 <no_reply@tomaat.com>',
          to: admin,
          subject: "Someone has signed up to Tomaat",
          text: "Click this",
          html: `${name} has signed up to Tomaat with the email address ${email}`
        });
      })

      .catch(err => {
        console.log("WRONG", err);
        res.json("Help");
      });
  });
});

router.get("/confirm/:code", (req, res, next) => {
  code = req.params.code;

  User.findOneAndUpdate(
    { confirmationCode: code },
    {
      accountStatus: "Active"
    }
  )
    .then(user => {
      res.render("index", { emailMessage: "E-mail active!" });
    })
    .catch(() => {});
});

router.get("/preferences", ensureAuthenticated, (req, res) => {
  res.render("auth/preferences");
});

router.post("/preferences", ensureAuthenticated, (req, res) => {
  const { cuisines } = req.body.preferences;
  const filteredCuisines = cuisines.filter(el => {
    if (metaData.cuisine.includes(el)) {
      return el;
    }
  });

  const { allergies } = req.body.preferences;
  const filteredAllergies = allergies.filter(el => {
    if (metaData.allergy.includes(el)) {
      return el;
    }
  });

  const { diets } = req.body.preferences;
  const filteredDiets = diets.filter(el => {
    if (metaData.diet.includes(el)) {
      return el;
    }
  });

  User.findByIdAndUpdate(req.user._id, {
    preferences: {
      cuisines: filteredCuisines,
      diets: filteredDiets,
      allergies: filteredAllergies
    }
  }).then(user => {
    res.redirect("/");
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.patch("/accountPreferences", ensureAuthenticated, (req, res) => {
  const { cuisines } = req.body.preferences;
  const userCuisines = req.user.preferences.cuisines;
  let filteredCuisines = cuisines.filter(el => {
    if (metaData.cuisine.includes(el)) {
      return el;
    }
  });

  const { allergies } = req.body.preferences;
  const userAllergies = req.user.preferences.allergies;
  let filteredAllergies = allergies.filter(el => {
    if (metaData.allergy.includes(el)) {
      return el;
    }
  });

  const { diets } = req.body.preferences;
  const userDiets = req.user.preferences.diets;
  let filteredDiets = diets.filter(el => {
    if (metaData.diet.includes(el)) {
      return el;
    }
  });

  filteredCuisines = [...cuisines, ...userCuisines];
  filteredAllergies = [...allergies, ...userAllergies];
  filteredDiets = [...diets, ...userDiets];

  User.findByIdAndUpdate(req.user._id, {
    preferences: {
      cuisines: filteredCuisines,
      diets: filteredDiets,
      allergies: filteredAllergies
    }
  }).then(user => {
    console.log("Then Working");
    res.render("account");
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
