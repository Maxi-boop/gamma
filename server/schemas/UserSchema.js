const z = require("zod");

const nameSchema = z.string().min(4).max(255);
const emailSchema = z.email().min(6).max(255);
const passwordSchema = z
  .string()
  .min(10)
  .max(1024)
  .refine((password) => /[a-z]/.test(password), {
    message: "Password must have at least one lowercase character.",
  })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password must have at least one uppercase character.",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "Password must have at least one number.",
  })
  .refine(
    (password) => /[@!#$%^&*()_\-+\[\]\{\}:;'"<>,.?\/\\`~=]/.test(password),
    { message: "Password must contain at least one symbol." },
  );
  
const isAdmin = z.boolean();
const isApproved = z.boolean();

const userSchema = z.object({
  nameSchema: nameSchema,
  emailSchema: emailSchema,
  passwordSchema: passwordSchema,
  isAdmin: isAdmin,
  isApproved: isApproved,
});

module.exports = {
  userSchema: userSchema,
  otherSchemas: {
    nameSchema: nameSchema,
    emailSchema: emailSchema,
    passwordSchema: passwordSchema,
    isAdmin: isAdmin,
    isApproved: isApproved,
  },
};
