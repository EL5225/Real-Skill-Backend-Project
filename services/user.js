const prisma = require("../libs/prisma");
const { queryClassById } = require("../utils/helpers/class");

const getAllUserService = async (page, limit) => {
  return await prisma.user.findMany({
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
      notifications: {
        select: {
          id: true,
          title: true,
          body: true,
          created_at: true,
          is_read: true,
        },
      },
      class: true,
      created_at: true,
    },
  });
};

const accessFreeClassService = async (user_id, class_id) => {
  await prisma.classes.update({
    where: {
      id: class_id,
    },
    data: {
      user: {
        connect: {
          id: user_id,
        },
      },
    },
  });

  const thisClass = await queryClassById(class_id);

  thisClass?.chapters?.map(async (chapter) => {
    await prisma.completed.create({
      data: {
        chapter_id: chapter?.id,
        user_id,
      },
    });

    chapter.videos?.map(async (video) => {
      await prisma.watched.create({
        data: {
          video_id: video.id,
          user_id,
        },
      });
    });
  });
};

module.exports = {
  getAllUserService,
  accessFreeClassService,
};
