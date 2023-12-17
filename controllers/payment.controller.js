const { VSCreatePayment } = require("../libs/validation/payment");
const { createPaymentService } = require("../services/payment");

const createPayment = async (req, res, next) => {
  try {
    const { payment_method, class_id, user_id } = req.body;
    VSCreatePayment.parse(req.body);

    const newPayment = await createPaymentService(payment_method, class_id, user_id);

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
