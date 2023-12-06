const { Router } = require("express");
const {
  getAllCategory,
  getAllLevel,
  getAllTypes,
  createPublicNotifications,
} = require("../controllers/general.controller");
const general = Router();

general.get("/categories", getAllCategory);
general.get("/levels", getAllLevel);
general.get("/types", getAllTypes);
general.post("/notifications", createPublicNotifications);

module.exports = general;
