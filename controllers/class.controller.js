const prisma = require("../libs/prisma");

const updateClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category_id, level_id } = req.body;

    const existingClass = await prisma.classes.findUnique({
      where: {
        id,
      },
    });

    if (!existingClass) {
      return res.status(404).json({
        status: false,
        message: "Bad Request",
        error: "Kelas tidak ditemukan",
      });
    }

    const updatedClass = await prisma.classes.update({
      where: { id: parseInt(id) },
      data: {
        name,
        category_id: parseInt(category_id),
        level_id: parseInt(level_id),
      },
    });

    res.status(200).json({
      status: true,
      message: "Kelas berhasil diperbarui",
      data: updatedClass,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateClass };
