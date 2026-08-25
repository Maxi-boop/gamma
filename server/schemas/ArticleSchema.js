const z = require("zod");
const mongoose = require("mongoose");

const textSchema = z.string().min(1);
const titleSchema = z.string().min(1);
const volumeSchema = z.int().min(100).max(999);
const issueSchema = z.int().min(1).max(30);
const sectionSchema = z.int().min(0).max(9);
const summarySchema = z.string().min(1);
const coverImageSchema = z.string().min(1);
const subsectionSchema = z.string().min(1).max(50);

const contributorSchema = z.string().min(1);
const contributorsSchema = z.array(contributorSchema).nonempty();

const articleSchema = z.object({
  text: textSchema,
  title: titleSchema,
  volume: volumeSchema,
  issue: issueSchema,
  section_id: sectionSchema,
  summary: summarySchema,
  cover_image: coverImageSchema.optional(),
  sub_section: subsectionSchema.optional(),
  contributors: contributorsSchema.nonempty(),
  cover_image_contributor: contributorSchema.optional(),
});

module.exports = {
  articleSchema: articleSchema,
  otherSchemas: {
    titleSchema: titleSchema,
    volumeSchema: volumeSchema,
    issueSchema: issueSchema,
    contributorSchema: contributorSchema,
  },
};
