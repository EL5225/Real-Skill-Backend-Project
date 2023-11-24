const { Router } = require("express");
const { deleteUser } = require("../controllers/user.controller");

const user = Router();

user.delete("/:id", deleteUser);

module.exports = user;
