const prisma = require("../libs/prisma");

const deleteChapterService = (id) => {
  const chapter = prisma.chapters.delete({
    where: {
      id,
    },
  });

  return chapter;
};

const updateChapterModuleService = async (class_id) => {
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
};

const createNewClassService = async (
  image_url,
  name,
  code,
  price,
  about,
  goals,
  author,
  category_id,
  type_id,
  level_id,
) => {
  return await prisma.classes.create({
    data: {
      image_url,
      name,
      code,
      price: Number(price),
      about,
      goals: goals,
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
};

module.exports = {
  deleteChapterService,
  updateChapterModuleService,
  createNewClassService,
};
