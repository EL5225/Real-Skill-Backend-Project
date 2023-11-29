const { Router } = require("express");
const { deleteUser, getAllUsers, getUserById } = require("../controllers/user.controller");

const user = Router();

user.get("/", getAllUsers);
user.get("/:id", getUserById);
user.delete("/:id", deleteUser);

module.exports = user;
