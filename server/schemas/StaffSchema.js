const z = require("zod");

const nameSchema = z.string().min(1).max(256);
const emailSchema = z.email();
const slugSchema = z.string().min(1).max(256);
const positionSchema = z.string().optional();
const roleSchema = z.string().max(256).optional();
const descriptionSchema = z.string().max(2000).optional();
const pfpUrlSchema = z.string().optional();
const yearsSchema = z.array(z.number()).optional();
const createdAtSchema = z.date();

const staffSchema = z.object({
  nameSchema: nameSchema,
  emailSchema: emailSchema,
  slugSchema: slugSchema,
  positionSchema: positionSchema,
  roleSchema: roleSchema,
  descriptionSchema: descriptionSchema,
  pfpUrlSchema: pfpUrlSchema,
  yearsSchema: yearsSchema,
  createdAtSchema: createdAtSchema,
});

module.exports = {
  staffSchema: staffSchema,
  otherSchemas: {
    nameSchema: nameSchema,
    emailSchema: emailSchema,
    slugSchema: slugSchema,
    positionSchema: positionSchema,
    roleSchema: roleSchema,
    descriptionSchema: descriptionSchema,
    pfpUrlSchema: pfpUrlSchema,
    yearsSchema: yearsSchema,
    createdAtSchema: createdAtSchema,
  },
};
