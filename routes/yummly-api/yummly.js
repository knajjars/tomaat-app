const express = require("express");
const router = express.Router();
const Yummly = require("ws-yummly");

Yummly.config({
  app_id: process.env.API_ID,
  app_key: process.env.API_KEY
});

module.exports = router;
