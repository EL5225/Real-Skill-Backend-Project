const { Router } = require("express");
const { getAllCategory, getAllLevel } = require("../controllers/general.controller");
const general = Router();

general.get("/categories", getAllCategory);
general.get("/levels", getAllLevel);

module.exports = general;
