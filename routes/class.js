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
const { imageUpload } = require("../libs/multer");

const course = Router();

course.get("/", getListClass);
course.post("/", guardAdmin, imageUpload.single("class_image"), createClass);
course.get("/:id", getClassById);
course.put("/:id", guardAdmin, updateClass);
course.delete("/:id", guardAdmin, deleteClass);
course.post("/chapters", guardAdmin, createChapters);
course.put("/chapters/:id", guardAdmin, updateChapter);

module.exports = course;
