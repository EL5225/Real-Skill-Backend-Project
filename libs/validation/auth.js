const { z } = require("zod");

const VSRegister = z.object({
  name: z.string({
    required_error: "Name harus diisi",
    invalid_type_error: "Name harus berupa string",
  }),
  email: z.string({ required_error: "Email harus diisi" }).email({ message: "Email harus valid" }),
  password: z.string({ required_error: "Password harus diisi" }).min(8),
  confirm_password: z.string({ required_error: "Konfirmasi Password harus diisi" }).min(8),
  phone_number: z
    .string({
      required_error: "Nomor Telepon harus diisi",
      invalid_type_error: "Nomor Telepon harus berupa string",
    })
    .min(10, { message: "Nomor Telepon harus minimal 10 digit" })
    .max(13, { message: "Nomor Telepon harus maximal 13 digit" }),
  role: z.string().optional(),
});

const VSLogin = z.object({
  email: z.string({ required_error: "Email harus diisi" }).email({ message: "Email harus valid" }),
  password: z.string({ required_error: "Password harus diisi" }).min(8),
});

const VSResetPassword = z.object({
  new_password: z.string({ required_error: "Password harus diisi" }).min(8),
  confirm_new_password: z.string({ required_error: "Konfirmasi Password harus diisi" }).min(8),
});

module.exports = {
  VSRegister,
  VSLogin,
  VSResetPassword,
};
