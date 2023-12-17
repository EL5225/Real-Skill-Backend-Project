const prisma = require("../libs/prisma");

const createPaymentService = async (payment_method, class_id, user_id) => {
  return await prisma.payments.create({
    data: {
      payment_method,
      class: {
        connect: {
          id: class_id,
        },
      },
      user: {
        connect: {
          id: user_id,
        },
      },
    },
  });
};

module.exports = {
  createPaymentService,
};
