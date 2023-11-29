const prisma = require("../libs/prisma");

const getAllCategory = async (req, res, next) => {
  try {
    const category = await prisma.categories.findMany();

    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Bad Request",
        error: "Category tidak ditemukan",
      });
    }

    res.status(200).json({
      status: true,
      message: "Berhasil mengambil category",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

const getAllLevel = async (req, res, next) => {
  try {
    const level = await prisma.levels.findMany();

    if (!level) {
      return res.status(404).json({
        status: false,
        message: "Bad Request",
        error: "Level tidak ditemukan",
      });
    }

    res.status(200).json({
      status: true,
      message: "Berhasil mengambil level",
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
