const prisma = require("../libs/prisma");

const deleteChapterService = (id) => {
  const chapter = prisma.chapters.delete({
    where: {
      id,
    },
  });

  return chapter;
};

const updateChapterModuleService = async (class_id, chapter_id) => {
  const { _count } = await prisma.chapters.aggregate({
    where: {
      class_id,
    },
    _count: {
      id: true,
    },
  });

  if (!chapter_id) {
    return;
  }

  const user = await prisma.user.findMany({
    where: {
      class: {
        some: {
          id: class_id,
        },
      },
    },
    select: {
      id: true,
      name: true,
      class: {
        where: {
          chapters: {
            some: {
              id: chapter_id,
            },
          },
        },
        select: {
          chapters: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (user.length !== 0) {
    const videos = await prisma.videos.findMany({
      where: {
        chapter_id,
      },
    });

    user?.map(async (user) => {
      await prisma.completed.create({
        data: {
          chapter_id,
          user_id: user.id,
        },
      });

      videos?.map(async (video) => {
        await prisma.watched.create({
          data: {
            video_id: video.id,
            user_id: user.id,
          },
        });
      });
    });
  }

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
