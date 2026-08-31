const router = require("express").Router();
const articleRouter = require("./articleRouter");
const authRouter = require("./auth");
const imageRouter = require("./imageRouter");
const testRouter = require("./test");

router.use("/article", articleRouter);
router.use("/auth", authRouter);
router.use("/image", imageRouter);

//TEST ROUTE IS ONLY FOR DEVELOPMENT PURPOSES!!!
if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
  router.use("/test", testRouter);
}

module.exports = router;
