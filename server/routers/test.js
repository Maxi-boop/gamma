const router = require("express").Router();
const sharp = require("sharp");
const path = require("node:path");
const fs = require("node:fs");

router.get("/compressPhoto", async (req, res) => {
  try {
    const image = sharp(path.join(__dirname, "..", "public", "catPhoto.avif"));
    const { width, height } = await image.metadata();
    const data = image
      .clone()
      .resize({ width: 500 })
      .jpeg({ quality: 80 })
      .toFile("cat-optimized.jpg");

    const fileHTML = `
        <!doctype html>
        <html>
            <head>
                <title>Image Test</title>
            </head>
            <body>
                <img src="./catPhoto.avif" width="1000"/>
                <img src="./cat-optimized.jpg" width="1000" />
            </body>
        </html>
    `;

    fs.writeFile(path.join(__dirname, "..", "public", "index.html"), fileHTML, (err) => {
      if (err) {
        console.error(err);
      } else {
        res.send("Go to http://localhost:3000/static/index.html");
      }
    });
  } catch (error) {
    console.error(error);
    res.send("OOPS! An error has occured.", error);
  }
});

module.exports = router;
