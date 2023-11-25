const prisma = require("../libs/prisma");
const bcrypt = require("bcrypt");
const { VSRegister } = require("../libs/validation/auth");
const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmation_password, phone_number, role } = req.body;

    VSRegister.parse(req.body);

    if (password !== confirmation_password) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        error: "Password dan Konfirmasi Password harus sama",
        data: null,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        error: "Email sudah terdaftar",
        data: null,
      });
    }

    const decryptedPassword = await bcrypt.hash(password, 10);

    const user = role
      ? await prisma.user.create({
          data: {
            name,
            email,
            password: decryptedPassword,
            role,
            profile: {
              create: {
                phone_number,
              },
            },
          },

          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            created_at: true,
            profile: true,
          },
        })
      : await prisma.user.create({
          data: {
            name,
            email,
            password: decryptedPassword,
            profile: {
              create: {
                phone_number,
              },
            },
          },

          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            created_at: true,
            profile: true,
          },
        });

    res.status(200).json({
      status: true,
      message: "Registrasi berhasil",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register };
