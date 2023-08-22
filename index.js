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
    for (let i = 1; i < 4; i++) {
      await sharp(req.files[0].path)
        .rotate()
        .resize(i * 600)
        .jpeg()
        .toFile(
          `./convertedimages/${i * 600}pixels${req.files[0].originalname}`
        );
    }
    res.send("Converted Images");
  } catch (e) {
    console.log("hiii");
    res.send(e);
  }
});

app.listen(PORT, () => console.log("Server started on port: 3000"));
