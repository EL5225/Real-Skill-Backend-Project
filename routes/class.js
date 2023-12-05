const { Router } = require("express");
const { updateClass } = require("../controllers/class.controller");
const course = Router();

course.put("/classes/:id", updateClass);

module.exports = course;
