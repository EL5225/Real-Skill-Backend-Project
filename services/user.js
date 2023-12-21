const prisma = require("../libs/prisma");

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

module.exports = {
  getAllUserService,
};
