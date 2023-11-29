const { Router } = require("express");
const { updateProfile } = require("../controllers/profile.controllers");
const { authorizationHeader } = require("../middlewares/auth");

const profile = Router();

profile.put("/", authorizationHeader, updateProfile);

module.exports = profile;
