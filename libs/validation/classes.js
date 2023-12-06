const { z } = require("zod");

const VSCreateClass = z.object({
  name: z.string({
    required_error: "name harus diisi",
    invalid_type_error: "name harus berupa string",
  }),
  code: z.string({
    required_error: "code harus diisi",
    invalid_type_error: "code harus berupa string",
  }),
  price: z
    .number({
      required_error: "price harus diisi",
      invalid_type_error: "price harus berupa angka",
    })
    .min(1, { message: "price harus diisi" }),
  about: z
    .string({
      required_error: "about harus diisi",
      invalid_type_error: "about harus berupa string",
    })
    .min(1, { message: "about harus diisi" }),
  author: z
    .string({
      required_error: "author harus diisi",
      invalid_type_error: "author harus berupa string",
    })
    .min(1, { message: "author harus diisi" }),

  category_id: z
    .number({
      required_error: "category_id harus diisi",
      invalid_type_error: "category_id harus berupa id (number)",
    })
    .min(1, { message: "category_id harus diisi" }),
  level_id: z
    .number({
      required_error: "level_id harus diisi",
      invalid_type_error: "level_id harus berupa id (number)",
    })
    .min(1, { message: "level_id harus diisi" }),
  type_id: z
    .number({
      required_error: "type_id harus diisi",
      invalid_type_error: "type_id harus berupa id (number)",
    })
    .min(1, { message: "type_id harus diisi" }),
});

const VSCUpdateClass = z.object({
  name: z
    .string({
      invalid_type_error: "name harus berupa string",
    })
    .optional(),
  code: z
    .string({
      invalid_type_error: "code harus berupa string",
    })
    .optional(),
  price: z
    .number({
      invalid_type_error: "price harus berupa angka",
    })
    .optional(),
  about: z
    .string({
      invalid_type_error: "about harus berupa string",
    })
    .optional(),
  author: z
    .string({
      invalid_type_error: "author harus berupa string",
    })
    .optional(),
  modules: z
    .number({
      invalid_type_error: "modules harus berupa angka",
    })
    .optional(),
  category_id: z
    .number({
      invalid_type_error: "category_id harus berupa id (number)",
    })
    .optional(),
  level_id: z
    .number({
      invalid_type_error: "level_id harus berupa id (number)",
    })
    .optional(),
  type_id: z
    .number({
      invalid_type_error: "type_id harus berupa id (number)",
    })
    .optional(),
});

const VSCreateChapter = z.object({
  title: z
    .string({
      required_error: "title harus diisi",
      invalid_type_error: "title harus berupa string",
    })
    .min(1, { message: "title harus diisi" }),
  videos: z.array(
    z.object({
      title: z
        .string({
          required_error: "title harus diisi",
          invalid_type_error: "title harus berupa string",
        })
        .min(1, { message: "title harus diisi" }),
      link: z
        .string({
          required_error: "link harus diisi",
          invalid_type_error: "link harus berupa string",
        })
        .min(1, { message: "link harus diisi" }),
      time: z
        .number({
          required_error: "time harus diisi",
          invalid_type_error: "time harus berupa angka",
        })
        .min(1, { message: "time harus diisi" }),
    }),
  ),
  class_id: z.string({
    required_error: "class_id harus diisi",
    invalid_type_error: "class_id harus berupa id (number)",
  }),
});

module.exports = {
  VSCreateClass,
  VSCUpdateClass,
  VSCreateChapter,
};