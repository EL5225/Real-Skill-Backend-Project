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

const createNewClassService = async (props) => {
  const rating = Math.floor(5 * 10) / 10;

  return await prisma.classes.create({
    data: {
      image_url: props?.image_url,
      name: props?.name,
      code: props?.code,
      price: Number(props?.price),
      about: props?.about,
      goals: props?.goals,
      author: props?.author,
      rating: Number(rating),
      category: {
        connect: {
          id: Number(props?.category_id),
        },
      },
      type: {
        connect: {
          id: Number(props?.type_id),
        },
      },
      level: {
        connect: {
          id: Number(props?.level_id),
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
