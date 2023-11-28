const { Router } = require("express");
const {
  deleteUser,
  updateUser,
  getAllUsers,
  getUserById,
} = require("../controllers/user.controller");

const user = Router();

user.delete("/:id", deleteUser);
user.put("/users/id:", updateUser);
user.get("/", getAllUsers);
user.get("/:id", getUserById);

module.exports = user;
