const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const User = require("../../server/model/userModel");
const PDF = require("../../server/model/pdfModel");
const fs = require("fs");

const deletePdf = async (req, res) => {
  try {
    const { filename } = req.params;
    console.log(filename);
    const pd = await PDF.findOne({ pdfUrl: filename });
    console.log(pd);

    if (pd) {
      await PDF.findByIdAndDelete({ _id: pd._id });
      await User.updateMany(
        { pdf: pd._id },
        { $pull: { pdf: pd._id } },
        { new: true }
      );
    }

    const filePath = path.join(__dirname, "pdfs", filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(204).send();
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getPdfs = async (req, res) => {
  try {
    const allPdf = await PDF.find({});

    if (allPdf.length != 0) {
      res.status(201).send(allPdf);
    } else {
      res.status(404).json({ error: "No File" });
    }
  } catch (error) {
    res.status(500).json({ error: error.code });
  }
};
module.exports = { deletePdf, getPdfs };
