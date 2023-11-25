const { Router } = require("express");
const {
  register,
  login,
  authenticated,
  resetPassword,
  forgotPassword,
} = require("../controllers/auth.controller");
const { authorizationHeader, authorizationQuery } = require("../middlewares/auth");

const auth = Router();

auth.post("/register", register);
auth.post("/login", login);
auth.get("/authenticated", authorizationHeader, authenticated);
auth.post("/forgot-password", forgotPassword);
auth.post("/reset-password", authorizationQuery, resetPassword);
module.exports = auth;
