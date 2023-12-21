const { Router } = require("express");
const {
  deleteUser,
  getAllUsers,
  getUserById,
  createNotifications,
  watchedVideoUser,
} = require("../controllers/user.controller");
const { guardAdmin, authorizationHeader } = require("../middlewares/auth");

const user = Router();

user.get("/", getAllUsers);
user.get("/:id", getUserById);
user.delete("/:id", deleteUser);
user.get("/videos/watched/:video_id", authorizationHeader, watchedVideoUser);
user.post("/notifications", guardAdmin, createNotifications);

module.exports = user;
