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

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phoneNumber } = req.body;

    if (!name || !phoneNumber) {
      return res.status(400).json({
        status: false,
        message: "Nama and No. HP harus diisi",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name },
    });

    const updatedProfile = await prisma.profiles.upsert({
      where: { user_id: id },
      update: { phone_number: phoneNumber },
      create: { user: { connect: { id } }, phone_number: phoneNumber },
    });

    if (!updatedUser || !updatedProfile) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        error: null,
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "User berhasil diperbarui",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  deleteUser,
  updateUser,
};
