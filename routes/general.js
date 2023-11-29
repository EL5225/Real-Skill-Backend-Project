const { Router } = require("express");
const { getAllTypes } = require("../controllers/general.controller");

const general = Router();

general.get("/types", getAllTypes);

module.exports = general;
