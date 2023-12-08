const { Router } = require("express");
const {
  createChapters,
  getListClass,
  getClassById,
  updateClass,
  createClass,
  deleteClass,
  updateChapter,
} = require("../controllers/class.controller");
const { guardAdmin } = require("../middlewares/auth");
const course = Router();

course.use(guardAdmin);

course.get("/", getListClass);
course.post("/", createClass);
course.get("/:id", getClassById);
course.put("/:id", updateClass);
course.delete("/:id", deleteClass);
course.post("/chapters", createChapters);
course.put("/chapters/:id", updateChapter);

module.exports = course;
