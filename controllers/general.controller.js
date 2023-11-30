const prisma = require("../libs/prisma");

const getAllCategory = async (req, res, next) => {
  try {
    const categories = await prisma.categories.findMany();

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Bad Request",
        error: "Category tidak ditemukan",
      });
    }

    res.status(200).json({
      status: true,
      message: "Berhasil mengambil category",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

const getAllLevel = async (req, res, next) => {
  try {
    const levels = await prisma.levels.findMany();

    if (!levels || levels.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Bad Request",
        error: "Level tidak ditemukan",
      });
    }

    res.status(200).json({
      status: true,
      message: "Berhasil mengambil level",
      data: levels,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTypes = async (req, res, next) => {
  try {
    const types = await prisma.types.findMany();

    if (!types || types.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Types tidak ditemukan",
      });
    }

    res.status(200).json({
      status: true,
      message: "Berhasil mengambil semua type",
      data: types,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategory,
  getAllLevel,
  getAllTypes,
};
