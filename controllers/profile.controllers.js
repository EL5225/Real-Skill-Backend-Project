const prisma = require("../libs/prisma");
const { VSUpdateProfile } = require("../libs/validation/profile");
const cloudinary = require("../libs/cloudinary");

// Update Profile berdasarkan id user
const updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const { name, phone_number, country, city } = req.body;

    VSUpdateProfile.parse(req.body);

    const timestamp = Date.now();
    const public_id = `profile_${timestamp}_realskills`;

    const uploadImage = () => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image", public_id }, async (err, result) => {
            if (err) {
              reject(err?.message);
            } else {
              resolve(result?.secure_url);
            }
          })
          .end(req?.file?.buffer);
      });
    };

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: name || user.name,
      },
    });

    await uploadImage()
      .then(async (result) => {
        await prisma.profiles.update({
          where: {
            user_id: user.id,
          },
          data: {
            profile_picture: result,
            phone_number: phone_number || user?.profile?.phone_number,
            country: country || user?.profile?.country,
            city: city || user?.profile?.city,
          },
        });
      })
      .catch(async () => {
        await prisma.profiles.update({
          where: {
            user_id: user.id,
          },
          data: {
            profile_picture: user?.profile?.profile_picture,
            phone_number: phone_number || user?.profile?.phone_number,
            country: country || user?.profile?.country,
            city: city || user?.profile?.city,
          },
        });
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
