const prisma = require("../libs/prisma");
const { VSUpdateProfile } = require("../libs/validation/profile");

const updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const { profile_picture, name, phone_number } = req.body;

    VSUpdateProfile.parse(req.body);

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name,
      },
    });

    const updatedProfile = await prisma.profiles.update({
      where: {
        user_id: user.id,
      },
      data: {
        profile_picture,
        phone_number,
      },
    });

    if (!updatedUser || !updatedProfile) {
      return res.status(404).json({
        status: false,
        message: "User tidak ditemukan",
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
  updateProfile,
};
