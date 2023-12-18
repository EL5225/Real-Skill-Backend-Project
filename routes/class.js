const { Router } = require("express");
const {
  createChapters,
  getListClass,
  getClassById,
  updateClass,
  createClass,
  deleteClass,
  updateChapter,
  deleteChapter,
} = require("../controllers/class.controller");
const { guardAdmin } = require("../middlewares/auth");
const { imageUpload } = require("../libs/multer");
const { editVideo, deleteVideo } = require("../controllers/video.controller");

const course = Router();

course.get("/", getListClass);
course.post("/", guardAdmin, imageUpload.single("class_image"), createClass);
course.get("/:id", getClassById);
course.put("/:id", guardAdmin, imageUpload.single("class_image"), updateClass);
course.delete("/:id", guardAdmin, deleteClass);

// Chapters
course.post("/chapters", guardAdmin, createChapters);
course.put("/chapters/:id", guardAdmin, updateChapter);
course.delete("/chapters/:id", guardAdmin, deleteChapter);

// Video
course.put("/chapters/videos/:id", guardAdmin, editVideo);
course.delete("/chapters/videos/:id", guardAdmin, deleteVideo);

module.exports = course;
