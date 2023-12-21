const prisma = require("../libs/prisma");
const { queryUserById } = require("../utils/helpers/user");

const editVideoService = async (id, title, body, time) => {
  const video = await prisma.videos.update({
    where: {
      id,
    },
    data: {
      title,
      body,
      time,
    },
  });

  return video;
};

const deleteVideoService = async (id) => {
  const video = await prisma.videos.delete({
    where: {
      id,
    },
  });

  return video;
};

const watchedVideoService = async (video_id, user_id) => {
  const video = await prisma.user.update({
    where: {
      id: user_id,
    },
    data: {
      watched_videos: {
        update: {
          where: {
            video_id_user_id: {
              video_id,
              user_id,
            },
          },
          data: {
            is_watched: true,
          },
        },
      },
    },
    select: {
      watched_videos: {
        orderBy: {
          video: {
            chapter: {
              no_chapter: "asc",
            },
          },
        },
        select: {
          is_watched: true,
          video: {
            select: {
              id: true,
              title: true,
              link: true,
              time: true,
              chapter: {
                select: {
                  no_chapter: true,
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const user = await queryUserById(user_id);

  const thisChapter = user?.watched_videos?.find((item) => item?.video?.id === video_id).video
    ?.chapter_id;

  const chapterVideos = await prisma.videos.findMany({
    where: {
      chapter_id: thisChapter,
    },
  });

  const isWatchedVideos = user?.watched_videos?.filter(
    (item) => item?.is_watched === true && item?.video?.chapter_id === thisChapter,
  ).length;

  if (chapterVideos?.length === isWatchedVideos) {
    await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        completed_chapters: {
          update: {
            where: {
              chapter_id_user_id: {
                chapter_id: thisChapter,
                user_id,
              },
            },
            data: {
              is_completed: true,
            },
          },
        },
      },
    });
  }

  return video;
};

module.exports = {
  editVideoService,
  deleteVideoService,
  watchedVideoService,
};
