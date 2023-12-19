const prisma = require("../libs/prisma");

const createPaymentService = async (payment_method, class_id, user_id) => {
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

const updatePaymentService = async (class_id, payments) => {
  const id = payments?.find((payment) => payment?.class_id === class_id)?.id;

  return await prisma.payments.update({
    where: {
      id,
    },
    data: {
      is_paid: true,
    },
  });
};

const deletePaymentService = async (id) => {
  return await prisma.payments.delete({
    where: {
      id,
    },
  });
};

module.exports = {
  createPaymentService,
  updatePaymentService,
  deletePaymentService,
};
