const path = require("path");
const multer = require("multer");
const express = require("express");
const sharp = require("sharp");
const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.get("/", (req, res) => {
  return res.render("homepage");
});

app.post("/resize", upload.array("files", 1), async (req, res) => {
  try {
    if (!req.files) {
      throw Error("No files selected");
    }
    let width;
    let height;
    let type;
    for (let i = 0; i < 3; i++) {
      if (i === 0) {
        width = 92;
        height = 92;
        type = "Thumbnail";
      }
      if (i === 1) {
        width = 1080;
        height = 1080;
        type = "Medium";
      }
      if (i === 2) {
        width = 1920;
        height = 1080;
        type = "Large";
      }
      await sharp(req.files[0].path)
        .rotate()
        .resize(width, height)
        .jpeg({ mozjpeg: true })
        .toFile(`./convertedimages/${type}${req.files[0].filename}`);
    }

    res.send("Converted Images");
  } catch (e) {
    console.log("hiii");
    res.send(e);
  }
});

app.listen(PORT, () => console.log("Server started on port: 3000"));
