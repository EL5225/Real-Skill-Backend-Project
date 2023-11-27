const { Router } = require("express");
const { deleteUser, getAllUsers, getUserById } = require("../controllers/user.controller");

const user = Router();

user.delete("/:id", deleteUser);
user.get("/", getAllUsers);
user.get("/:id", getUserById);

module.exports = user;
