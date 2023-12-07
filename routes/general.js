const { Router } = require("express");
const { getAllCategory, getAllLevel, getAllTypes } = require("../controllers/general.controller");
const general = Router();

general.get("/categories", getAllCategory);
general.get("/levels", getAllLevel);
general.get("/types", getAllTypes);

module.exports = general;
