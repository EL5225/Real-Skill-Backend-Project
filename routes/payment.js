const { Router } = require("express");
const {
  createPayment,
  updatePayment,
  getPaymentById,
  deletePayment,
} = require("../controllers/payment.controller");
const { authorizationHeader } = require("../middlewares/auth");
const payment = Router();

payment.post("/", authorizationHeader, createPayment);
payment.get("/paid/:class_id", authorizationHeader, updatePayment);
payment.get("/:id", authorizationHeader, getPaymentById);
payment.delete("/:id", authorizationHeader, deletePayment);

module.exports = payment;
