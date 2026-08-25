const router = require("express").Router();
const articleRouter = require("./articleRouter");
const authRouter = require("./auth");
const Staff = require("../models/Staff");

const validateToken =
  require("../middlewares/authenticationMiddleware").validateToken;

router.use("/", validateToken);
router.use("/article", articleRouter);
router.use("/auth", authRouter);

module.exports = router;
