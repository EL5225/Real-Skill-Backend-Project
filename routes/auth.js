const { Router } = require("express");
const { register } = require("../controllers/auth.controller");

const auth = Router();

auth.post("/register", register);

module.exports = auth;
