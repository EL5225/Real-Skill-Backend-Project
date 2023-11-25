const prisma = require("../libs/prisma");
const bcrypt = require("bcrypt");
const { VSRegister, VSLogin, VSResetPassword } = require("../libs/validation/auth");
const nodemailer = require("nodemailer");
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

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
