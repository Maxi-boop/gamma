const router = require("express").Router();
const articleRouter = require("./articleRouter");
const authRouter = require("./auth");

router.use("/article", articleRouter);
router.use("/auth", authRouter);

module.exports = router;
