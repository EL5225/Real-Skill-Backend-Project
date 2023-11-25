const { Router } = require("express");
const {
  register,
  login,
  whoami,
  resetPassword,
  forgotPassword,
} = require("../controllers/auth.controller");
const { authorizationHeader, authorizationQuery } = require("../middlewares/auth");

const auth = Router();

auth.post("/register", register);
auth.post("/login", login);
auth.get("/whoami", authorizationHeader, whoami);
auth.post("/forgot-password", forgotPassword);
auth.post("/reset-password", authorizationQuery, resetPassword);
module.exports = auth;
