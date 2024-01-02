const { z } = require("zod");

const VSCreatePayment = z.object({
  payment_method: z.string({
    required_error: "payment_method harus diisi",
    invalid_type_error: "payment_method harus berupa string",
  }),
  class_id: z.string({
    required_error: "class_id harus diisi",
    invalid_type_error: "class_id harus berupa string",
  }),
});

module.exports = {
  VSCreatePayment,
};
