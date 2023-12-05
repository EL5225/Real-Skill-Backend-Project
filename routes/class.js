const { Router } = require("express");
const course = Router();
const { createChapters, getListClass, getClassById } = require("../controllers/class.controller");

course.post("/chapters", createChapters);
course.get("/", getListClass);
course.get("/:id", getClassById);

module.exports = course;
