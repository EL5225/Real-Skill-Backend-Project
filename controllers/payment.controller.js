const prisma = require("../libs/prisma");

const createPayment = async (req, res, next) => {
  try {
    const { payment_method, class_id } = req.body;

    if (!payment_method || !class_id) {
      return res.status(400).json({ error: "Masukkan metode pembayaran dan ID kelas" });
    }

    const newPayment = await prisma.payments.create({
      data: {
        payment_method,
        class_id,
      },
    });

    return res.status(200).json({ message: "Pembayaran berhasil dibuat", payment: newPayment });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPayment };
