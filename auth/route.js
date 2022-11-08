const express = require("express");
const { userAuth } = require("./auth");
const router = express.Router()
const { register, login, viewProfile, getRandomJoke, logout } = require("./users")

//routes for api
router.route("/signup").post(register)
router.route("/login").post(login);
router.route("/me").get(userAuth, viewProfile);

router.route("/logout").get(userAuth, logout);
module.exports = router