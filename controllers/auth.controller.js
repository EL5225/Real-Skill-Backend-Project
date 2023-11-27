const prisma = require("../libs/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { VSResetPassword, VSRegister, VSLogin } = require("../libs/validation/auth");
const { sendEmail } = require("../utils/nodemailer");
const { JWT_SECRET } = process.env;

const register = async (req, res, next) => {
  try {
    const { name, email, password, confirm_password, phone_number, role } = req.body;

    VSRegister.parse(req.body);

    const name = name;

    if (password !== confirm_password) {
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
        error: "Email atau password salah",
        data: null,
      });
    }

    const isPasswordValid = bcrypt.compare(password, user.password);

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
      JWT_SECRET,
    );

    res.status(200).json({
      status: true,
      message: "Login berhasil",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const authenticated = async (req, res, next) => {
  try {
    const user = req.user;
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

const forgotPassword = async (req, res, next) => {
  try {
    const { email, phone_number } = req.body;

    const user = email
      ? await prisma.user.findUnique({ where: { email } })
      : await prisma.profiles.findUnique({
          where: {
            phone_number,
          },
          select: {
            user: {
              select: {
                email: true,
              },
            },
          },
        });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Bad Request",
        error: "User Tidak ditemukan",
        data: null,
      });
    }

    const token = jwt.sign(
      {
        id: email ? user.id : user.user_id,
      },
      JWT_SECRET,
      {
        expiresIn: "3m",
      },
    );

    const path = `${req.protocol}://${req.get("host")}/api/auth/reset-password?token=${token}`;

    sendEmail(email ? email : user.user.email, "Link untuk reset password", path);

    res.status(200).json({
      status: true,
      message: "Link untuk reset password telah dikirim ke email kamu!",
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const user = req.user;
    const { new_password, confirm_new_password } = req.body;

    VSResetPassword.parse(req.body);

    if (new_password !== confirm_new_password) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        error: "Password dan Confirmation Password harus sama",
        data: null,
      });
    }

    const decryptedPassword = await bcrypt.hash(new_password, 10);
    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        password: decryptedPassword,
      },
    });

    res.status(200).json({
      status: true,
      message: "Password telah berhasil diubah",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, authenticated, resetPassword, forgotPassword };
