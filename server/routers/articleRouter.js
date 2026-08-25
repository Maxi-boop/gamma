const router = require("express").Router();
const articleSchema = require("../schemas/ArticleSchema").articleSchema;
const { titleSchema, volumeSchema, issueSchema } =
  require("../schemas/ArticleSchema").otherSchemas;
const { nameSchema, emailSchema } =
  require("../schemas/StaffSchema").otherSchemas;
const Article = require("../models/ArticleModel");
const Staff = require("../models/Staff");
const z = require("zod");

router.post("/", async (req, res, next) => {
  try {
    const jsonData = req.body;

    //Check to see if there is a body found in the json data.
    if (!jsonData) {
      throw new Error("Request does not have a body.");
    }

    //MAKE SURE THAT THE SCHEMA MATCHES UP WITH THE DATA
    if (!articleSchema.safeParse(jsonData).success) {
      throw new Error("Sent data does not match article schema.");
    }

    console.log(jsonData);
    res.send(jsonData);
  } catch (error) {
    next(error);
  }
});

//FOR GRABBING ARTICLE BASED ON TITLE ALONE
router.get("/", async (req, res, next) => {
  try {
    const jsonData = req.body;

    //Check to see if there is a body found in the json data.
    if (!jsonData) {
      throw new Error("Request does not have a body.");
    }

    //FOR CHECKING THE BODY TO MAKE SURE IT MACHES THE SCHEMA PROPERLY
    const zodBody = z.object({
      title: titleSchema,
    });

    if (!zodBody.safeParse(jsonData)) {
      throw new Error(
        "Request is incorrectly formatted or does not include a title element.",
      );
    }

    //Find on database
    const article = await Article.find({ title: jsonData.title });
    res.send(article);
  } catch (error) {
    next(error);
  }
});

//FOR GRABBING ARTICLE BASED ON VOLUME AND ISSUE (OPTIONAL: TITLE)
router.get("/:volume/:issue", async (req, res, next) => {
  try {
    const jsonData = req.body;
    const zodBody = z.object({
      title: titleSchema,
    });

    const volumeParameter = req.params.volume;
    const issueParameter = req.params.issue;

    //THROW ERRORS FOR SCHEMA PROBLEMS.
    if (!volumeSchema.safeParse(Number(volumeParameter)))
      throw new Error(
        "Volume Parameter is not from 100-999, or is not a number.",
      );
    if (!issueSchema.safeParse(Number(issueParameter)))
      throw new Error("Issue Parameter is not from 1-30, or is not a number.");

    let article;

    if (jsonData && Object.hasOwn(jsonData, "title")) {
      if (!zodBody.safeParse(jsonData))
        throw new Error(
          "Request is incorrectly formatted or does not include a title element.",
        );

      article = await Article.find({
        title: jsonData.title,
        volume: volumeParameter,
        issue: issueParameter,
      });
    } else {
      article = await Article.find({
        volume: volumeParameter,
        issue: issueParameter,
      });
    }

    res.send(article);
  } catch (error) {
    next(error);
  }
});

//FOR GRABBING ARTICLES FROM AN AUTHOR
//USING ONLY THE NAME AND THE EMAIL
router.get("/author", async (req, res, next) => {
  try {
    const jsonData = req.body;
    const authorNameObject = z.object({
      name: nameSchema,
      email: emailSchema,
    });
    //Check to see if there is a body found in the json data.
    if (!jsonData) {
      throw new Error("Request does not have a body.");
    }
    //See if there is a formatting validation error.
    if (!authorNameObject.safeParse(jsonData)) {
      throw new Error("Schema validation error.");
    }
    //Look for the staff memebr.
    staffMember = await Staff.findOne({
      name: jsonData.name,
      email: jsonData.email,
    });
    //Check to see if the staff member exists.
    if (!staffMember) {
      throw new Error("Could not find staff member.");
    }
    //Find the article with the staff member as a contributor.
    article = await Article.find({
      contributors: staffMember._id,
    });
    //Send the article.
    res.send(article);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
