const { z } = require("zod");

const VScreateNotification = z.object({
  title: z.string({
    required_error: "title harus diisi",
    invalid_type_error: "title harus berupa string",
  }),
  body: z.string({
    required_error: "body harus diisi",
    invalid_type_error: "body harus berupa string",
  }),
  user_ids: z.array(z.string({})).optional(),
  is_all_user: z.boolean().optional(),
});

module.exports = {
  VScreateNotification,
};
