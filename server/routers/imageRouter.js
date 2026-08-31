const router = require("express").Router();
const { validateToken } = require("../middlewares/authenticationMiddleware");
const { imageSchema } = require("../schemas/ImageSchema");
const { validateJsonBody } = require("../middlewares/generalMiddleware");

const multer = require("multer");
const upload = multer();

const sharp = require("sharp");
const uuidv7 = require("uuid").v7;

const { Upload } = require("@aws-sdk/lib-storage");

const s3 = require("../aws");

router.use("/", validateToken);
// router.use("/", validateJsonBody);

router.post("/upload", upload.single("image"), async (req, res, next) => {
  try {
    const jsonBody = req.body;

    if (!req.file) {
      throw new Error("No image was found.");
    }

    const file = req.file.buffer;
    const image = sharp(file);
    let { height, width } = await image.metadata();

    image.resize({ width: 750 }).jpeg({ quality: 80 });

    const imageBuffer = await image.toBuffer();
    const fileName = process.env.MEDIA_DIR + "/" + uuidv7() + ".jpg";

    const imageParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      Body: imageBuffer,
      ContentType: "image/jpeg",
    };

    const upload = new Upload({
        client: s3,
        params: imageParams
    });

    const updata = await upload.done();
    res.send({ success: true, public_url: updata.Location });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
