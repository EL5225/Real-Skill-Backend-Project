const prisma = require("../libs/prisma");
const bcrypt = require("bcrypt");
const { VSRegister } = require("../libs/validation/auth");
const nodemailer = require("nodemailer");
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmation_password, phone_number, role } =
      req.body;

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
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    VSLogin.parse(req.body);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        error: "Email dan password salah",
        data: null,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        error: "email dan password salah",
        data: null,
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      JWT_SECRET
    );

    res.status(200).json({
      status: true,
      message: "Login berhasil",
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

const whoami = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        error: null,
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: "User found",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

const resetPassword = async (req, res, next) => {
  try {
    const { email, new_password, confirmation_new_password } = req.body;

    VSResetPassword.parse(req.body);

    if (new_password !== confirmation_new_password) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        error: "Password dan Confirmation Password harus sama",
        data: "null",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
        error: null,
        data: null,
      });
    }

    const decryptedPassword = await bcrypt.hash(new_password, 10);

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: decryptedPassword,
      },
    });

    await transporter.sendMail({
      from: emailUser,
      to: email,
      subject: "Password Reset Successful",
      text: "Password Anda berhasil diperbaharui",
    });

    res.status(200).json({
      status: true,
      message: "Password reset berhasil",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, whoami, resetPassword };
