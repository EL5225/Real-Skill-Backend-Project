const { Router } = require("express");
const {
  createChapters,
  getListClass,
  getClassById,
  updateClass,
} = require("../controllers/class.controller");
const course = Router();

course.post("/chapters", createChapters);
course.get("/", getListClass);
course.get("/:id", getClassById);
course.put("/classes/:id", updateClass);

module.exports = course;
