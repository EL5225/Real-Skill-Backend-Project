const prisma = require("../libs/prisma");
const { VSUpdateProfile } = require("../libs/validation/profile");
const cloudinary = require("../libs/cloudinary");

// Update Profile berdasarkan id user
const updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const { name, phone_number } = req.body;

    VSUpdateProfile.parse(req.body);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name,
      },
    });

    const timestamp = Date.now();
    const public_id = `profile_${timestamp}_realskills`;

    cloudinary.uploader
      .upload_stream({ resource_type: "image", public_id }, async (err, result) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            error: err.message,
          });
        }
        await prisma.profiles.update({
          where: {
            user_id: user.id,
          },
          data: {
            profile_picture: result.secure_url,
            phone_number,
          },
        });
      })
      .end(req.file.buffer);

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
