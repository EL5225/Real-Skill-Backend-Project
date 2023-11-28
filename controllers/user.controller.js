const prisma = require("../libs/prisma");
const getPagination = require("../utils/pagination");

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });

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

const getAllUsers = async (req, res, next) => {
  try {
    let { limit = 10, page = 1 } = req.query;
    limit = Number(limit);
    page = Number(page);

    const users = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    const { _count } = await prisma.user.aggregate({
      _count: { id: true },
    });

    let pagination = getPagination(req, _count.id, page, limit);

    if (!users) {
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
      data: { users, pagination },
    });
  } catch (error) {
    next(error);
  }
};

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
  getAllUsers,
  getUserById,
  updateUser,
};
