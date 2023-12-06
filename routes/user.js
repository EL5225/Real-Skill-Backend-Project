const { Router } = require("express");
const {
  deleteUser,
  getAllUsers,
  getUserById,
  createNotifications,
} = require("../controllers/user.controller");

const user = Router();

user.get("/", getAllUsers);
user.get("/:id", getUserById);
user.delete("/:id", deleteUser);
user.post("/notifications", createNotifications);

module.exports = user;
