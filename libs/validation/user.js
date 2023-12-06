const { z } = require("zod");

const VScreateNotification = z.object({
  user_id: z.string({
    required_error: "user_id harus diisi",
    invalid_type_error: "user harus berupa string",
  }),
  title: z.string({
    required_error: "title harus diisi",
    invalid_type_error: "title harus berupa string",
  }),
  body: z.string({
    required_error: "body harus diisi",
    invalid_type_error: "body harus berupa string",
  }),
});

module.exports = {
  VScreateNotification,
};
