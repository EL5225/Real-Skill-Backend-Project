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
  price: z.string().optional(),
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
    .string({
      required_error: "category_id harus diisi",
      invalid_type_error: "category_id harus berupa id (string)",
    })
    .min(1, { message: "category_id harus diisi" }),
  level_id: z
    .string({
      required_error: "level_id harus diisi",
      invalid_type_error: "level_id harus berupa id (string)",
    })
    .min(1, { message: "level_id harus diisi" }),
  type_id: z
    .string({
      required_error: "type_id harus diisi",
      invalid_type_error: "type_id harus berupa id (string)",
    })
    .min(1, { message: "type_id harus diisi" }),
});

const VSCUpdateClass = z.object({
  name: z.string({
    required_error: "name harus diisi",
    invalid_type_error: "name harus berupa string",
  }),
  code: z.string({
    required_error: "code harus diisi",
    invalid_type_error: "code harus berupa string",
  }),
  price: z.string().optional(),
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
    .string({
      required_error: "category_id harus diisi",
      invalid_type_error: "category_id harus berupa id (string)",
    })
    .min(1, { message: "category_id harus diisi" }),
  level_id: z
    .string({
      required_error: "level_id harus diisi",
      invalid_type_error: "level_id harus berupa id (string)",
    })
    .min(1, { message: "level_id harus diisi" }),
  type_id: z
    .string({
      required_error: "type_id harus diisi",
      invalid_type_error: "type_id harus berupa id (string)",
    })
    .min(1, { message: "type_id harus diisi" }),
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

const VSCUpdateChapter = z.object({
  title: z
    .string({
      invalid_type_error: "title harus berupa string",
    })
    .optional(),
  videos: z
    .array(
      z.object({
        title: z
          .string({
            invalid_type_error: "title harus berupa string",
          })
          .optional(),
        link: z
          .string({
            invalid_type_error: "link harus berupa string",
          })
          .optional(),
        time: z
          .number({
            invalid_type_error: "time harus berupa angka",
          })
          .optional(),
      }),
    )
    .optional(),
});

module.exports = {
  VSCreateClass,
  VSCUpdateClass,
  VSCreateChapter,
  VSCUpdateChapter,
};
