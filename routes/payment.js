const { Router } = require("express");
const { createPayment } = require("../controllers/payment.controller");
const payment = Router();

payment.post("/", createPayment);

module.exports = payment;
