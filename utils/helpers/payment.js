const prisma = require("../../libs/prisma");

const findFirstPayment = async (class_id, user_id) => {
  return await prisma.payments.findFirst({
    where: {
      class_id,
      user_id,
    },
  });
};

const queryPaymentById = async (id) => {
  return await prisma.payments.findUnique({
    where: {
      id,
    },
    include: {
      class: true,
    },
  });
};

module.exports = {
  findFirstPayment,
  queryPaymentById,
};
