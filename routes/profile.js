const { Router } = require("express");
const { updateProfile } = require("../controllers/profile.controllers");
const { authorizationHeader } = require("../middlewares/auth");
const { imageUpload } = require("../libs/multer");

const profile = Router();

profile.put("/", authorizationHeader, imageUpload.single("profile_picture"), updateProfile);

module.exports = profile;
