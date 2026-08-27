const { titleSchema } = require("../schemas/ArticleSchema").otherSchemas;
const Artilce = require("../models/ArticleModel");
const Draft = require("../models/Draft");

function createSlug(req, res, next) {
  try {
    const jsonData = req.body;
    if (!jsonData) {
      throw new Error("Request body cannot be found.");
    }

    const title = req.body.title;
    if (!title) {
      throw new Error("Title cannot be found in request body.");
    }

    if (!titleSchema.safeParse(title).success) {
      throw new Error("Title is incorrect type.");
    }

    const slug = String(title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z ]/g, "")
      .replace(new RegExp(" ", "g"), "-");

    console.log(slug);

    req.body = { ...req.body, slug: slug };
    next();
  } catch (error) {
    next(error);
  }
}

async function validateArticleOriginality(req, res, next) {
  try {
    const jsonData = req.body;

    const findArticle = await Article.find({
      $or: [{ title: jsonData.title }, { slug: jsonData.slug }],
    });

    if (findArticle && findArticle.length >= 1) {
      res.status(409);
      throw new Error("An article exists with the same title or slug.");
    }

    next();
  } catch (error) {
    next(error);
  }
}

async function validateDraftOriginality(req, res, next) {
  try {
    const jsonData = req.body;
    const findDraft = await Draft.find({
      $or: [{ title: jsonData.title }, { slug: jsonData.slug }],
    });

    if (findDraft && findDraft.length >= 1) {
      res.status(409);
      throw new Error("A draft already exists with the same title or slug.");
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createSlugMiddleware: createSlug,
  validateArticleOriginalityMiddleware: validateArticleOriginality,
  validateDraftOriginalityMiddleware: validateDraftOriginality,
};
