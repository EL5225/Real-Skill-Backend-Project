const prisma = require("../libs/prisma");

const getAllCategory = async (req, res, next) => {
  try {
    let category = await prisma.categories.findMany();

    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
        error: null,
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Category found",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

const getAllLevel = async (req, res, next) => {
  try {
    let level = await prisma.levels.findMany();

    if (!level) {
      return res.status(404).json({
        status: false,
        message: "Level not found",
        error: null,
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "Level found",
      data: level,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategory,
  getAllLevel,
};
