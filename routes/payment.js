const { Router } = require("express");
const {
  createPayment,
  updatePayment,
  getPaymentById,
  deletePayment,
  getAllPayments,
} = require("../controllers/payment.controller");
const { authorizationHeader } = require("../middlewares/auth");
const payment = Router();

payment.post("/", authorizationHeader, createPayment);
payment.get("/", authorizationHeader, getAllPayments);
payment.get("/:id", authorizationHeader, getPaymentById);
payment.get("/paid/:class_id", authorizationHeader, updatePayment);
payment.delete("/:id", authorizationHeader, deletePayment);

module.exports = payment;
