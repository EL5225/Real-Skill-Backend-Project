const prisma = require("../libs/prisma");

const createUser = async (name, email, password, phone_number) => {
  return await prisma.user.create({
    data: {
      name,
      email,
      password,
      profile: {
        create: {
          phone_number,
        },
      },
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      created_at: true,
      profile: true,
    },
  });
};

module.exports = {
  createUser,
};
