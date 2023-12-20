const prisma = require("../libs/prisma");
const { queryChaptersById } = require("../utils/helpers/class");
const { queryVideoById } = require("../utils/helpers/video");

const editVideoService = async (id, title, body, time, is_watched) => {
  const existingVideo = await queryVideoById(id);

  const video = await prisma.videos.update({
    where: {
      id,
    },
    data: {
      title,
      body,
      time,
      is_watched,
    },
  });

  const thisChapter = await queryChaptersById(existingVideo.chapter_id);
  const allVideos = thisChapter?.videos?.length;
  const isWatchedVideos = thisChapter?.videos?.filter((item) => item.is_watched === true).length;

  if (allVideos === isWatchedVideos) {
    await prisma.chapters.update({
      where: {
        id: existingVideo.chapter_id,
      },
      data: {
        is_completed: true,
      },
    });
  }

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

module.exports = {
  editVideoService,
  deleteVideoService,
};
