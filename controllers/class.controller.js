const prisma = require("../libs/prisma");
const {
  VSCreateClass,
  VSCUpdateClass,
  VSCreateChapter,
  VSCUpdateChapter,
} = require("../libs/validation/classes");
const getPagination = require("../utils/pagination");
const cloudinary = require("../libs/cloudinary");
const {
  queryClassById,
  queryChaptersById,
  queryClassByCode,
  queryClassByIdWithUser,
} = require("../utils/helpers/class");
const {
  deleteChapterService,
  updateChapterModuleService,
  createNewClassService,
} = require("../services/class");
const { newVideoService } = require("../services/video");
const { queryUserById } = require("../utils/helpers/user");
// Fitur Membuat kelas
const createClass = async (req, res, next) => {
  try {
    const {
      name,
      code,
      price,
      about,
      goals,
      prerequisites,
      author,
      category_id,
      type_id,
      level_id,
    } = req.body;
    VSCreateClass.parse(req.body);

    const existClass = await queryClassByCode(code);

    if (existClass) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        error: "Code kelas sudah ada",
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

    const parsedGoals = Array.isArray(goals)
      ? goals
      : goals?.split(",")?.map((goal) => goal?.trim());

    const parsedPrerequisites = Array.isArray(prerequisites)
      ? prerequisites
      : prerequisites?.split(",")?.map((pre) => pre?.trim());

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
        const newClass = await createNewClassService({
          image_url: result?.secure_url,
          name,
          code,
          price,
          about,
          goals: parsedGoals,
          prerequisites: parsedPrerequisites,
          author,
          category_id,
          type_id,
          level_id,
        });

        res.status(201).json({
          status: true,
          message: "Berhasil menambahkan kelas",
          data: newClass,
        });
      })
      .end(req?.file?.buffer);
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
            id: true,
            no_chapter: true,
            title: true,
            videos: {
              select: {
                id: true,
                no_video: true,
                title: true,
                link: true,
                time: true,
              },
            },
          },
        },
      },
    });

    if (!classes || classes.length === 0) {
      return res.status(200).json({
        status: false,
        message: "Kelas tidak ditemukan",
        data: [],
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
    const user = req.user;
    const { id } = req.params;

    const typeClass = await prisma?.types?.findFirst({
      where: {
        classes: {
          some: {
            id,
          },
        },
      },
    });

    if (typeClass?.id === 1) {
      const classes = await queryClassByIdWithUser(id, user.id);

      if (!classes) {
        return res.status(404).json({
          status: false,
          message: "Bad Request",
          error: "Id class tidak ditemukan",
        });
      }
      return res.status(200).json({
        status: true,
        message: "Berhasil mengambil class berdasarkan id",
        data: classes,
      });
    } else {
      const userPayment = await queryUserById(user?.id);
      const isUserPaid = userPayment?.payments?.find(
        (payment) => payment?.class_id === id,
      )?.is_paid;

      const classes = isUserPaid
        ? await queryClassByIdWithUser(id, user?.id)
        : await queryClassById(id);

      if (!classes) {
        return res.status(404).json({
          status: false,
          message: "Bad Request",
          error: "Id class tidak ditemukan",
        });
      }
      return res.status(200).json({
        status: true,
        message: "Berhasil mengambil class berdasarkan id",
        data: classes,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Fitur Memperbarui kelas berdasarkan id
const updateClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      code,
      price,
      about,
      goals,
      author,
      prerequisites,
      modules,
      category_id,
      type_id,
      level_id,
    } = req.body;
    VSCUpdateClass.parse(req.body);

    const existingClass = await queryClassById(id);
    if (!existingClass) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        error: "Kelas tidak ditemukan",
      });
    }

    const parsedGoals = Array.isArray(goals)
      ? goals
      : goals?.split(",")?.map((goal) => goal?.trim());

    const parsedPrerequisites = Array.isArray(prerequisites)
      ? prerequisites
      : prerequisites?.split(",")?.map((pre) => pre?.trim());

    if (req.file && req.file.buffer) {
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

          const updatedClass = await prisma.classes.update({
            where: {
              id,
            },
            data: {
              image_url: result.secure_url ? result.secure_url : existingClass.image_url,
              name: name ? name : existingClass.name,
              code: code ? code : existingClass.code,
              price: price ? Number(price) : existingClass.price,
              about: about ? about : existingClass.about,
              goals: parsedGoals ? parsedGoals : existingClass.goals,
              prerequisites: parsedPrerequisites
                ? parsedPrerequisites
                : existingClass.prerequisites,
              author: author ? author : existingClass.author,
              modules: modules ? Number(modules) : existingClass.modules,
              category_id: category_id ? Number(category_id) : existingClass.category_id,
              type_id: type_id ? Number(type_id) : existingClass.type_id,
              level_id: level_id ? Number(level_id) : existingClass.level_id,
            },
          });

          res.status(200).json({
            status: true,
            message: "Berhasil memperbarui kelas",
            data: updatedClass,
          });
        })
        .end(req.file.buffer);
    } else {
      const updatedClass = await prisma.classes.update({
        where: {
          id,
        },
        data: {
          name: name ? name : existingClass.name,
          code: code ? code : existingClass.code,
          price: price ? Number(price) : existingClass.price,
          about: about ? about : existingClass.about,
          goals: parsedGoals ? parsedGoals : existingClass.goals,
          author: author ? author : existingClass.author,
          prerequisites: parsedPrerequisites ? parsedPrerequisites : existingClass.prerequisites,
          modules: modules ? Number(modules) : existingClass.modules,
          category_id: category_id ? Number(category_id) : existingClass.category_id,
          type_id: type_id ? Number(type_id) : existingClass.type_id,
          level_id: level_id ? Number(level_id) : existingClass.level_id,
        },
      });

      res.status(200).json({
        status: true,
        message: "Berhasil memperbarui kelas",
        data: updatedClass,
      });
    }
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
    const { no_chapter, title, videos, class_id } = req.body;
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
      no_video: element.no_video,
      title: element.title,
      link: element.link,
      time: element.time,
    }));

    const chapters = await prisma.chapters.create({
      data: {
        no_chapter,
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

    await updateChapterModuleService(class_id, chapters.id);

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
    const { id } = req.params;
    const { no_chapter, title, videos } = req.body;
    VSCUpdateChapter.parse(req.body);

    const existingChapter = await queryChaptersById(id);

    if (!existingChapter) {
      return res.status(404).json({
        status: false,
        message: "Bad request",
        error: "Chapter tidak ditemukan",
      });
    }

    const updatedVideos = videos?.map((element) => ({
      no_video: element.no_video,
      title: element.title,
      link: element.link,
      time: element.time,
    }));

    let updatedChapter;

    if (videos) {
      updatedChapter = await prisma.chapters.update({
        where: {
          id,
        },
        data: {
          no_chapter,
          title,
          videos: {
            createMany: {
              data: updatedVideos,
            },
          },
        },
        include: {
          videos: {
            where: {
              no_video: {
                in: updatedVideos.map((element) => element.no_video),
              },
            },
          },
        },
      });

      await newVideoService(updatedChapter.class_id, updatedChapter.videos);
    } else {
      updatedChapter = await prisma.chapters.update({
        where: {
          id,
        },
        data: {
          title,
        },
      });
    }

    res.status(200).json({
      status: true,
      message: "Chapter berhasil diperbarui",
      data: updatedChapter,
    });
  } catch (error) {
    next(error);
  }
};

const deleteChapter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingChapter = await queryChaptersById(id);

    if (!existingChapter) {
      return res.status(404).json({
        status: false,
        message: "Bad request",
        error: "Chapter tidak ditemukan",
      });
    }

    const chapter = await deleteChapterService(id);

    await updateChapterModuleService(chapter.class_id);

    res.status(200).json({
      status: true,
      message: "Chapter berhasil di hapus",
      data: chapter,
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
  deleteChapter,
};
