const prisma = require("../libs/prisma");

const getAllTypes = async (req, res, next) => {
  try {
    const types = await prisma.types.findMany({
      include: {
        classes: true,
      },
    });

    if (!types || types.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Type not found",
        error: null,
        data: null,
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

const getAllCategory = async (req, res, next) => {
  try {
    const categories = await prisma.categories.findMany();

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
        error: null,
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
        message: "Level not found",
        error: null,
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

module.exports = {
  getAllCategory,
  getAllLevel,
  getAllTypes,
};
