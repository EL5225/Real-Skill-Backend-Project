const prisma = require("../libs/prisma");
const { VSCreatePayment } = require("../libs/validation/payment");
const {
  createPaymentService,
  updatePaymentService,
  deletePaymentService,
} = require("../services/payment");
const { queryClassById } = require("../utils/helpers/class");
const { findFirstPayment, queryPaymentById } = require("../utils/helpers/payment");

const createPayment = async (req, res, next) => {
  try {
    const user = req.user;
    const { payment_method, class_id } = req.body;
    VSCreatePayment.parse(req.body);

    const thisClass = await queryClassById(class_id);

    if (thisClass?.type_id !== 2) {
      return res.status(400).json({
        message: "Bad Request",
        error: "Tidak bisa membeli kelas yang Gratis",
      });
    }

    const existingPayment = await findFirstPayment(class_id, user?.id);

    if (existingPayment) {
      return res.status(400).json({
        message: "Bad Request",
        error: "Pembayaran sudah ada, silahkan membeli kelas lain",
      });
    }

    const newPayment = await createPaymentService(payment_method, class_id, user?.id);

    return res.status(200).json({
      message: "Pembayaran berhasil dibuat",
      data: newPayment,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPayments = async (req, res, next) => {
  try {
    const payments = await prisma.payments.findMany({
      include: {
        class: {
          include: {
            chapters: {
              include: {
                videos: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      message: "Berhasil mengambil semua pembayaran",
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

const updatePayment = async (req, res, next) => {
  try {
    const user = req.user;
    const { class_id } = req.params;

    await updatePaymentService(user?.id, class_id, user?.payments);

    return res.status(200).json({
      message: "Pembayaran berhasil dilakukan",
    });
  } catch (error) {
    next(error);
  }
};

const getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await queryPaymentById(id);

    if (!payment) {
      return res.status(404).json({
        message: "Data pembayaran tidak ditemukan",
      });
    }

    return res.status(200).json({
      message: "Data pembayaran ditemukan",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

const deletePayment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingPayment = await queryPaymentById(id);
    if (!existingPayment) {
      return res.status(404).json({
        message: "Not found",
        error: "Data pembayaran tidak ditemukan",
      });
    }

    if (existingPayment?.is_paid) {
      return res.status(400).json({
        message: "Bad Request",
        error: "Tidak bisa menghapus pembayaran yang sudah dibayar",
      });
    }

    const payment = await deletePaymentService(id);

    return res.status(200).json({
      message: "Pembayaran berhasil di hapus",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
  updatePayment,
  getAllPayments,
  getPaymentById,
  deletePayment,
};
