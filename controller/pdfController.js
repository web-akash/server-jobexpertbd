const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const User = require("../../server/model/userModel");
const PDF = require("../../server/model/pdfModel");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "pdfs/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
router.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
  const { email, subject, text, title } = req.body;
  const pdf = req.file ? req.file.filename : null;
  console.log(email, subject);
  //pdfUrl
  try {
    if (pdf) {
      const user = await User.findOne({ email: email });

      const mong = new PDF({
        teacherName: user.name,
        userId: User._id,
        subject: subject,
        pdfUrl: pdf,
        text: text,
        title: title,
      });
      mong.save();
      await User.findByIdAndUpdate(
        { _id: user._id },
        { $push: { pdf: mong._id } },
        { new: true }
      );

      res.status(200).json({ message: "Upload", pdf: User.pdf });
    } else {
      res.status(400).json({ error: "Fail" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error", reason: error.message });
  }
});

// delete pdf start

module.exports = router;
