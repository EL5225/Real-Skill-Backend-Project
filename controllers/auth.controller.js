const prisma = require("../libs/prisma");
const bcrypt = require("bcrypt");
const { VSRegister, VSLogin } = require("../libs/validation/auth");
const jwt = require("jsonwebtoken")
const { JWT_SECRET } = process.env

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

module.exports = { register, login, whoami };
