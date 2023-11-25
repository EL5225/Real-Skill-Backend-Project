const { Router } = require("express");
const {
  register,
  login,
  whoami,
  resetPassword,
} = require("../controllers/auth.controllers");

const auth = Router();

auth.post("/register", register);
auth.post("/login", login);
auth.get("/whoami", whoami);
auth.post("/reset-password", resetPassword);
module.exports = auth;
