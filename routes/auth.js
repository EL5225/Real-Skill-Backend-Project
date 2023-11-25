const { Router } = require("express");
const { register, login, whoami } = require("../controllers/auth.controller");

const auth = Router();

auth.post("/register", register);
auth.post("/login", login);
auth.get("/whoami", whoami);

module.exports = auth;
