const z = require("zod");

const imageSchema = z.object({
  image: z
    .string()
    .refine((file) => file.size > 10 * 1000000, {
      error: "Too large of a file.",
    })
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(
          file.type,
        ),
      { error: "Not a valid file type." },
    ),

  //   z
  //     .file("Not a file :(")
  //     .max(10 * 1_000_000, "Too large of an image.")
  //     .mime(
  //       ["image/jpeg", "image/png", "image/webp", "image/avif"],
  //       "Not a valid file type.",
  //     ),
});

module.exports = {
  imageSchema: imageSchema,
};
