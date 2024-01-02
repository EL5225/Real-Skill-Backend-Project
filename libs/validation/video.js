const { z } = require("zod");

const VSEditVideo = z.object({
  title: z
    .string({
      invalid_type_error: "title harus berupa string",
    })
    .optional(),
  body: z
    .string({
      invalid_type_error: "body harus berupa string",
    })
    .optional(),
  link: z
    .string({
      invalid_type_error: "link harus berupa string",
    })
    .optional(),
  time: z
    .number({
      invalid_type_error: "time harus berupa number",
    })
    .optional(),
  is_watched: z.boolean({ invalid_type_error: "is_watched harus berupa boolean" }).optional(),
});

module.exports = {
  VSEditVideo,
};
