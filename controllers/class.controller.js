const prisma = require("../libs/prisma");
const {
  VSCreateClass,
  VSCUpdateClass,
  VSCreateChapter,
  VSCUpdateChapter,
} = require("../libs/validation/classes");
const getPagination = require("../utils/pagination");
const cloudinary = require("../libs/cloudinary");
const { queryClassById } = require("../utils/helpers/class");
// Fitur Membuat kelas
const createClass = async (req, res, next) => {
  try {
    const { name, code, price, about, author, category_id, type_id, level_id } = req.body;
    VSCreateClass.parse(req.body);

    const existClass = await prisma.classes.findUnique({
      where: {
        code,
      },
    });

    if (existClass) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        error: "Code kelas sudah ada",
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        error: "Harga harus berupa angka positif",
      });
    }

    if (!category_id || !type_id || !level_id) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        error: "Semua kolom harus diisi",
      });
    }

    const existingCategory = await prisma.categories.findUnique({
      where: {
        id: Number(category_id),
      },
    });

    if (!existingCategory) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        error: "Kategori tidak ditemukan",
      });
    }

    const existingType = await prisma.types.findUnique({
      where: {
        id: Number(type_id),
      },
    });

    if (!existingType) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        error: "Tipe kelas tidak ditemukan",
      });
    }

    const existingLevel = await prisma.levels.findUnique({
      where: {
        id: Number(level_id),
      },
    });

    if (!existingLevel) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        error: "Level kelas tidak ditemukan",
      });
    }

    const timestamp = Date.now();
    const public_id = `class_${timestamp}_realskills`;

    cloudinary.uploader
      .upload_stream({ resource_type: "image", public_id }, async (err, result) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            error: err.message,
          });
        }
        const newClass = await prisma.classes.create({
          data: {
            image_url: result.secure_url,
            name,
            code,
            price: Number(price),
            about,
            author,
            category: {
              connect: {
                id: Number(category_id),
              },
            },
            type: {
              connect: {
                id: Number(type_id),
              },
            },
            level: {
              connect: {
                id: Number(level_id),
              },
            },
          },
        });

        res.status(201).json({
          status: true,
          message: "Berhasil menambahkan kelas",
          data: newClass,
        });
      })
      .end(req.file.buffer);
  } catch (error) {
    next(error);
  }
};

// Fitur Menampilkan daftar semua kelas
const getListClass = async (req, res, next) => {
  try {
    let { search, category, type, level, limit = 5, page = 1 } = req.query;
    limit = Number(limit);
    page = Number(page);

    const whereClause = {
      name: {
        contains: search,
        mode: "insensitive",
      },
      category_id: category
        ? {
            equals: Number(category),
          }
        : undefined,
      type_id: type
        ? {
            equals: Number(type),
          }
        : undefined,
      level_id: level
        ? {
            equals: Number(level),
          }
        : undefined,
    };

    const { _count } = await prisma.classes.aggregate({
      where: whereClause,
      _count: { id: true },
    });

    const classes = await prisma.classes.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        chapters: {
          select: {
            title: true,
            videos: true,
          },
        },
      },
    });

    if (!classes || classes.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Bad Request",
        error: "kelas tidak ada",
      });
    }

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

// Fitur Menemukan kelas berdasarkan id
const getClassById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const classes = await queryClassById(id);
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

// Fitur Memperbarui kelas berdasarkan id
const updateClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, code, price, about, author, modules, category_id, type_id, level_id } = req.body;
    VSCUpdateClass.parse(req.body);

    const existingClass = await queryClassById(id);
    if (!existingClass) {
      return res.status(404).json({
        status: false,
        message: "Bad Request",
        error: "Kelas tidak ditemukan",
      });
    }

    const updatedClass = await prisma.classes.update({
      where: {
        id,
      },
      data: {
        name,
        code,
        price: Number(price),
        about,
        author,
        modules: modules ? Number(modules) : existingClass.modules,
        category_id: category_id ? Number(category_id) : existingClass.category_id,
        type_id: type_id ? Number(type_id) : existingClass.type_id,
        level_id: level_id ? Number(level_id) : existingClass.level_id,
      },
    });

    res.status(200).json({
      status: true,
      message: "Kelas berhasil diperbarui",
      data: updatedClass,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Fitur Menghapus kelas berdasarkan id
const deleteClass = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingClass = await queryClassById(id);

    if (!existingClass) {
      return res.status(404).json({
        status: false,
        message: "Bad Request",
        error: "Kelas tidak ditemukan",
      });
    }

    const deletedClass = await prisma.classes.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: true,
      message: "Berhasil menghapus kelas",
      data: deletedClass,
    });
  } catch (error) {
    next(error);
  }
};

// Fitur Membuat chapters berdasarkan id kelas
const createChapters = async (req, res, next) => {
  try {
    const { title, videos, class_id } = req.body;
    VSCreateChapter.parse(req.body);

    const existingClass = await queryClassById(class_id);

    if (!existingClass) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        error: "Referenced class not found.",
      });
    }

    const newVideos = videos.map((element) => ({
      title: element.title,
      link: element.link,
      time: element.time,
    }));

    const chapters = await prisma.chapters.create({
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

    const { _count } = await prisma.chapters.aggregate({
      where: {
        class_id,
      },
      _count: {
        id: true,
      },
    });

    await prisma.classes.update({
      where: {
        id: class_id,
      },
      data: {
        modules: _count.id,
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

//Fitur memperbarui Chapter
const updateChapter = async (req, res, next) => {
  try {
    const { title, videos, class_id } = req.body;
    VSCUpdateChapter.parse(req.body);

    const existingChapter = await queryClassById(class_id);

    if (!existingChapter) {
      return res.status(404).json({
        status: false,
        message: "Bad request",
        error: "Chapter tidak ditemukan",
      });
    }

    const updatedVideos = videos.map((element) => ({
      title: element.title,
      link: element.link,
      time: element.time,
    }));

    const updatedChapter = await prisma.chapters.update({
      where: {
        id: class_id,
      },
      data: {
        title,
        videos: {
          deleteMany: {},
          createMany: {
            data: updatedVideos,
          },
        },
      },
    });

    res.status(200).json({
      status: true,
      message: "Chapter berhasil diperbarui",
      data: updatedChapter,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClass,
  createChapters,
  getListClass,
  getClassById,
  updateClass,
  deleteClass,
  updateChapter,
};
