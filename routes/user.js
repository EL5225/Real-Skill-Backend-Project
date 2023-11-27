const { Router } = require("express");
const { deleteUser, updateUser } = require("../controllers/user.controller");

const user = Router();

user.delete("/:id", deleteUser);
user.put("/users/id:", updateUser);

module.exports = user;
