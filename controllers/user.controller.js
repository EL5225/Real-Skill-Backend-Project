const prisma = require("../libs/prisma");

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.delete({ where: { id } });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        error: null,
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "User berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  deleteUser,
};
