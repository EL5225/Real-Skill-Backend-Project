const prisma = require("../../libs/prisma");

const queryUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      profile: true,
      class: true,
      notifications: true,
      payments: true,
    },
  });
};

const queryUserAdminId = async (admin_id) => {
  return await prisma.user.findUnique({
    where: {
      admin_id,
    },
  });
};

const queryUserById = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
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
        },
      },
      class: true,
      created_at: true,
    },
  });
};

module.exports = {
  queryUserByEmail,
  queryUserAdminId,
  queryUserById,
};
