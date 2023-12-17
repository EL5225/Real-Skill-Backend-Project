const prisma = require("../../libs/prisma");

const queryClassById = async (id) => {
  return await prisma.classes.findUnique({
    where: {
      id,
    },
    include: {
      chapters: {
        select: {
          id: true,
          title: true,
          is_completed: true,
          created_at: true,
          videos: {
            select: {
              id: true,
              title: true,
              link: true,
              time: true,
              is_watched: true,
            },
          },
        },
      },
    },
  });
};

const queryChaptersById = async (id) => {
  return await prisma.chapters.findUnique({
    where: {
      id,
    },
    include: {
      videos: {
        select: {
          id: true,
          title: true,
          link: true,
          time: true,
          is_watched: true,
        },
      },
    },
  });
};

const queryClassByCode = async (code) => {
  return await prisma.classes.findUnique({
    where: {
      code,
    },
    include: {
      chapters: {
        select: {
          id: true,
          title: true,
          is_completed: true,
          created_at: true,
          videos: {
            select: {
              id: true,
              title: true,
              link: true,
              time: true,
              is_watched: true,
            },
          },
        },
      },
    },
  });
};

module.exports = {
  queryClassById,
  queryChaptersById,
  queryClassByCode,
};
