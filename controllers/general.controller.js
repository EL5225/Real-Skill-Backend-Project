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

module.exports = { getAllTypes };
