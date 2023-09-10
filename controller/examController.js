const express = require("express");
const app = express();
const Exam = require("../model/examModel");
const ExamPackage = require("../model/examPackage");
const Question = require("../model/questionModel");

const examCreate = async (req, res) => {
  const {
    packageUid,
    examTitle,
    examTime,
    examSerial,
    examInfo,
    examMark,
    nid,
  } = req.body;

  try {
    const sea = await Exam.find({
      examSerial: examSerial,
      packageUid: `PK-${packageUid}`,
    });
    const seah = await ExamPackage.find({
      nid: nid,
    });

    console.log(sea.length);
    if (sea.length == 0 && seah.length != 0) {
      const search = await ExamPackage.find({
        packageUid: packageUid,
      });

      const examNew = new Exam({
        packageUid: `PK-${packageUid}`,
        examSerial,
        examTitle,
        examTime,
        examInfo,
        examMark,
        nid: seah[0].nid,
      });

      examNew.save();

      console.log(examNew._id, search[0]._id);

      const shrx = await Exam.findOneAndUpdate(
        { _id: examNew._id },
        { $push: { packageId: search[0]._id } },
        { new: true }
      );

      await ExamPackage.findOneAndUpdate(
        { _id: search[0]._id },
        { $push: { examList: examNew._id } },
        { new: true }
      );

      res.status(200).json(shrx);
    } else {
      res.status(402).json({ error: "Exam Name already Existed " });
    }
  } catch (error) {
    console.log(error.code);
    res.status(500).json({ error: "Error Occurs" });
  }
};

const deleteExam = async (req, res) => {
  const { nid, examSerial } = req.body;

  try {
    const sear = await Exam.find({ examSerial: examSerial, nid: nid });
    if (sear.length != 0) {
      const search = await Exam.findOne({ examSerial: examSerial });

      const how = search.packageUid.split("PK-");
      const nextPackage = await ExamPackage.findOne({
        packageUid: how[1].toString(),
      });

      if (search) {
        const deleteResult = await Question.deleteMany({
          examId: { $in: search._id },
        });

        await ExamPackage.findByIdAndUpdate(
          { _id: nextPackage._id },
          { $pull: { examList: { $in: search._id } } },
          { new: true }
        );
        await Exam.findOneAndDelete({ _id: search._id });
        res.status(200).json(deleteResult);
      } else {
        res.status(404).json({ message: "Package not found" });
      }
    } else {
      res.status(404).json({ error: "Invalid Entry" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {};
