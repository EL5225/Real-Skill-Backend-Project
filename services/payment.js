const prisma = require("../libs/prisma");
const { queryClassById } = require("../utils/helpers/class");

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

const updatePaymentService = async (user_id, class_id, payments) => {
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

  const thisClass = await queryClassById(class_id);

  thisClass?.chapters?.map(async (chapter) => {
    await prisma.completed.create({
      data: {
        chapter_id: chapter.id,
        user_id,
      },
    });

    chapter.videos?.map(async (video) => {
      await prisma.watched.create({
        data: {
          video_id: video.id,
          user_id,
        },
      });
    });
  });

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
