const express = require("express");
const { userAuth } = require("./auth");
const router = express.Router()
const {getRandomJoke } = require("./users")


router.route("/random-joke").get(userAuth, getRandomJoke);

module.exports = router