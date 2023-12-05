const prisma = require("../libs/prisma");
const getPagination = require("../utils/pagination");

const createChapters = async (req, res, next) => {
  try {
    let { title, videos, class_id } = req.body;

    let existingClass = await prisma.classes.findUnique({
      where: {
        id: class_id,
      },
    });

    if (!existingClass) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        error: "Referenced class not found.",
      });
    }

    let newVideos = videos.map((element) => ({
      title: element.title,
      link: element.link,
      time: element.time,
    }));

    let chapters = await prisma.chapters.create({
      data: {
        title,
        videos: {
          createMany: {
            data: newVideos,
          },
        },
        class: {
          connect: {
            id: class_id,
          },
        },
      },
      include: {
        videos: true,
      },
    });

    res.status(201).json({
      status: true,
      message: "Berhasil menambahkan chapter",
      data: chapters,
    });
  } catch (error) {
    next(error);
  }
};

const getListClass = async (req, res, next) => {
  try {
    let { limit = 5, page = 1 } = req.query;
    limit = Number(limit);
    page = Number(page);

    let classes = await prisma.classes.findMany({
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        // selanjutnya
      },
    });
    if (!classes || classes.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Bad Request",
        error: "kelas tidak ada",
      });
    }

    let { _count } = await prisma.classes.aggregate({
      _count: { id: true },
    });

    const pagination = getPagination(req, _count.id, page, limit);

    res.status(200).json({
      status: true,
      message: "Berhasil menampilkan daftar class",
      data: { classes, pagination },
    });
  } catch (error) {
    next(error);
  }
};

const getClassById = async (req, res, next) => {
  try {
    let { id } = req.params;
    let classes = await prisma.classes.findUnique({
      where: {
        id,
      },
    });
    if (!classes) {
      return res.status(404).json({
        status: false,
        message: "Bad Request",
        error: "Id class tidak ditemukan",
      });
    }
    res.status(200).json({
      status: true,
      message: "Berhasil mengambil class berdasarkan id",
      data: classes,
    });
  } catch (error) {
    next(error);
  }
};

const updateClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category_id, level_id } = req.body;

    const existingClass = await prisma.classes.findUnique({
      where: {
        id,
      },
    });

    if (!existingClass) {
      return res.status(404).json({
        status: false,
        message: "Bad Request",
        error: "Kelas tidak ditemukan",
      });
    }

    const updatedClass = await prisma.classes.update({
      where: { id: parseInt(id) },
      data: {
        name,
        category_id: parseInt(category_id),
        level_id: parseInt(level_id),
      },
    });

    res.status(200).json({
      status: true,
      message: "Kelas berhasil diperbarui",
      data: updatedClass,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createChapters,
  getListClass,
  getClassById,
  updateClass,
};
