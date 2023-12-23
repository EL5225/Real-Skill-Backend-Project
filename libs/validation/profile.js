const { z } = require("zod");

const VSUpdateProfile = z.object({
  name: z.string().optional(),
  phone_number: z
    .string()
    .min(10, { message: "Nomor Telepon harus minimal 10 digit" })
    .max(13, { message: "Nomor Telepon harus maximal 13 digit" })
    .optional(),
  country: z.string().optional(),
  city: z.string().optional(),
});

module.exports = {
  VSUpdateProfile,
};
