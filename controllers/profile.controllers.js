const prisma = require("../libs/prisma");
const { VSUpdateProfile } = require("../libs/validation/profile");
const cloudinary = require("../libs/cloudinary");

// Update Profile berdasarkan id user
const updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const { name, phone_number, country, city } = req.body;

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

    const uploadImage = () => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image", public_id }, async (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result.secure_url);
            }
          })
          .end(req.file.buffer);
      });
    };

    const uploadImageUrl = await uploadImage();

    await prisma.profiles.update({
      where: {
        user_id: user.id,
      },
      data: {
        profile_picture: uploadImageUrl,
        phone_number,
        country,
        city,
      },
    });

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
