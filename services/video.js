const prisma = require("../libs/prisma");

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

module.exports = {
  editVideoService,
  deleteVideoService,
};
