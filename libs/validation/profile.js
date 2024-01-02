const { z } = require("zod");

const VSUpdateProfile = z.object({
  name: z.string().optional(),
  phone_number: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
});

module.exports = {
  VSUpdateProfile,
};
