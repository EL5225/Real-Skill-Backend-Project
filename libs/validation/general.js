const { z } = require("zod");

const VScreatePublicNotification = z.object({
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
  VScreatePublicNotification,
};
