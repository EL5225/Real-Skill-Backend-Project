const prisma = require("../libs/prisma");
const getPagination = require("../utils/pagination");

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Bad Request",
        error: "User tidak ditemukan",
      });
    }

    res.status(200).json({
      status: true,
      message: "Data user ditemukan",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    let { limit = 5, page = 1 } = req.query;
    limit = Number(limit);
    page = Number(page);

    const users = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_verified: true,
        profile: {
          select: {
            id: true,
            profile_picture: true,
            phone_number: true,
            updated_at: true,
          },
        },
        created_at: true,
      },
    });

    const { _count } = await prisma.user.aggregate({
      _count: { id: true },
    });

    const pagination = getPagination(req, _count.id, page, limit);

    if (!users) {
      return res.status(404).json({
        status: false,
        message: "Bad Request",
        error: "User kosong",
      });
    }

    res.status(200).json({
      status: true,
      message: "Berhasil mendapatkan data users",
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
        message: "User tidak ditemukan",
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

module.exports = {
  deleteUser,
  getAllUsers,
  getUserById,
};
