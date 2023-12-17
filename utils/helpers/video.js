const prisma = require("../../libs/prisma");

const queryVideoById = (id) => {
  return prisma.videos.findUnique({
    where: {
      id,
    },
  });
};

module.exports = {
  queryVideoById,
};
