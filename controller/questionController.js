const express = require("express");
const app = express();
const Exam = require("../model/examModel");
const ExamPackage = require("../model/examPackage");
const Question = require("../model/questionModel");
const User = require("../model/userModel");

const createQuestion = async (req, res) => {
  const {
    whatIsTheQuestion,
    optionA,
    optionB,
    optionC,
    optionD,
    rightAnsOne,
    rightAnsTwo,
    ansDetail,
    rightMark,
    wrongMark,
    examSerial,
    nid,
    serial,
  } = req.body;

  try {
    const saerch = await ExamPackage.find({ examSerial, nid });

    if (saerch.length != 0) {
      const newQuestion = new Question({
        examTrack: saerch[0].packageUid,
        whatIsTheQuestion,
        optionA,
        optionB,
        optionC,
        optionD,
        rightAnsOne,
        rightAnsTwo,
        ansDetail,
        rightMark,
        wrongMark,
        serial,
      });
      newQuestion.save();
      await ExamPackage.findByIdAndUpdate(
        { _id: saerch[0]._id },
        { $push: { qestionList: newQuestion._id } },
        { new: true }
      );
      const crtQ = await Question.findOneAndUpdate(
        { _id: newQuestion._id },
        { $push: { examId: saerch[0]._id } }
      );
      res.status(201).json(crtQ);
    } else {
      res.status(401).json({ error: "Already ExamSerial Name exist" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const deleteQuestion = async (req, res) => {
  const { id } = req.body;

  console.log(id);
  try {
    const mx = await Question.findOne({ _id: id });

    if (mx) {
      await ExamPackage.findOneAndUpdate(
        { examSerial: mx.examTrack },
        { $pull: { qestionList: { $in: mx._id } } },
        { new: true }
      );
      await Question.findOneAndDelete({ _id: mx._id });
      res.status(202).json({ message: "Delete Success" });
    } else {
      res.status(400).json({ error: "Invalid Entry" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const packageQuestionList = async (req, res) => {
  const { packageUid, nid } = req.body;
  console.log(packageUid, nid);

  try {
    const search = await ExamPackage.find({
      packageUid: packageUid,
      nid: nid,
    }).populate("qestionList");
    console.log(search[0].qestionList.length);

    if (search[0].qestionList.length != 0) {
      res.status(200).send(search);
    } else {
      res.status(400).json({ error: "Invalid Entry" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server Error", mm: `${error.code}` });
  }
};

const whoCanExam = async (req, res) => {
  const { id, myId } = req.body;
  try {
    const search = await User.find({
      _id: myId,
      role: "Student",
      myExam: { $in: id },
    });
    if (search) {
      const myExam = await ExamPackage.findById({ _id: id }).populate(
        "qestionList"
      );

      res.send(myExam);
    } else {
      res.status(404).json({ errro: "No User found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error", code: error.code });
  }
};

module.exports = {
  createQuestion,
  deleteQuestion,
  packageQuestionList,
  whoCanExam,
};
