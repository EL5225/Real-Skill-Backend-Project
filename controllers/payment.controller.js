const prisma = require("../libs/prisma");
const { VSCreatePayment } = require("../libs/validation/payment");

const createPayment = async (req, res, next) => {
  try {
    const { payment_method, class_id, user_id } = req.body;
    VSCreatePayment.parse(req.body);
    const newPayment = await prisma.payments.create({
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

    return res.status(200).json({
      message: "Pembayaran berhasil dibuat",
      data: newPayment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
};
