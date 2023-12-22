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
          no_chapter: true,
          title: true,
          created_at: true,
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
};

const queryClassByIdWithUser = async (id, user_id) => {
  return await prisma.classes.findUnique({
    where: {
      id,
    },
    include: {
      chapters: {
        select: {
          id: true,
          no_chapter: true,
          title: true,
          created_at: true,
          complete_status: {
            where: {
              user_id,
            },
          },
          videos: {
            select: {
              id: true,
              no_video: true,
              title: true,
              link: true,
              time: true,
              watch_status: {
                where: {
                  user_id,
                },
              },
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
          created_at: true,
          videos: {
            select: {
              id: true,
              title: true,
              link: true,
              time: true,
            },
          },
        },
      },
    },
  });
};

const queryAllClasses = async () => {
  return await prisma.classes.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      category: true,
      type: true,
      level: true,
      created_at: true,
      chapters: {
        select: {
          id: true,
          title: true,
          created_at: true,
          videos: {
            select: {
              id: true,
              title: true,
              link: true,
              time: true,
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
  queryAllClasses,
  queryClassByIdWithUser,
};
