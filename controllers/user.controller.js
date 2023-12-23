const prisma = require("../libs/prisma");
const getPagination = require("../utils/pagination");
const { VScreateNotification } = require("../libs/validation/user");
const { queryUserById } = require("../utils/helpers/user");
const { getAllUserService, accessFreeClassService } = require("../services/user");
const { watchedVideoService } = require("../services/video");
const { queryClassById } = require("../utils/helpers/class");

// Mengambil data user berdasarkan id
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await queryUserById(id);

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

// Mengambil semua data user
const getAllUsers = async (req, res, next) => {
  try {
    let { limit = 5, page = 1 } = req.query;
    limit = Number(limit);
    page = Number(page);

    const users = await getAllUserService(page, limit);

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

// Menghapus data user berdasarkan id
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

// Buat notifikasi ke semua user
const createNotifications = async (req, res, next) => {
  try {
    const { title, body, user_ids, is_all_user } = req.body;
    VScreateNotification.parse(req.body);

    const filter = {
      is_verified: true,
    };

    if (!is_all_user && user_ids.length > 0) {
      filter.id = {
        in: user_ids,
      };
    }

    const users = await prisma.user.findMany({
      where: filter,
    });

    const notifications = await prisma.notifications.createMany({
      data: users.map((user) => ({
        title,
        body,
        user_id: user.id,
      })),
    });

    res.status(201).json({
      status: true,
      message: "Created Notification Success",
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

const watchedVideoUser = async (req, res, next) => {
  try {
    const user = req.user;
    const { video_id } = req.params;

    const watch = await watchedVideoService(video_id, user?.id);

    return res.status(200).json({
      status: true,
      message: "Berhasil mengubah video yang ditonton",
      data: watch,
    });
  } catch (error) {
    next(error);
  }
};

const accessFreeClass = async (req, res, next) => {
  try {
    const user = req.user;
    const { class_id } = req.params;

    const freeClass = await queryClassById(class_id);

    if (freeClass?.type_id !== 1) {
      return res.status(400).json({
        status: true,
        message: "Bad request",
        error: "Class ini bukan kelas gratis",
      });
    }

    await accessFreeClassService(user.id, class_id);

    return res.status(200).json({
      status: true,
      message: "Berhasil mengakses kelas gratis",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  deleteUser,
  getAllUsers,
  getUserById,
  createNotifications,
  watchedVideoUser,
  accessFreeClass,
};
