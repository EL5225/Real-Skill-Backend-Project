const { Router } = require("express");
const {
  deleteUser,
  getAllUsers,
  getUserById,
  createNotifications,
  watchedVideoUser,
  accessFreeClass,
  deleteNotification,
} = require("../controllers/user.controller");
const { guardAdmin, authorizationHeader } = require("../middlewares/auth");

const user = Router();

user.get("/", getAllUsers);
user.get("/:id", getUserById);
user.delete("/:id", deleteUser);
user.get("/videos/watched/:video_id", authorizationHeader, watchedVideoUser);
user.get("/class/access/free/:class_id", authorizationHeader, accessFreeClass);
user.post("/notifications", guardAdmin, createNotifications);
user.delete("/notifications/:id", authorizationHeader, deleteNotification);

module.exports = user;
