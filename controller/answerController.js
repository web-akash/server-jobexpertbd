const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const ExamPackage = require("../model/examPackage");
const Exam = require("../model/examModel");
const Question = require("../model/questionModel");
const Answer = require("../model/ansModel");
const Paper = require("../model/examPaperModel");
const { mongo } = require("mongoose");

const createExamPaper = async (req, res) => {
  const { packageUid, std, examCategory, packageName } = req.body;

  try {
    const match = await Paper.find({ packageUid: packageUid, examineeId: std });

    console.log(match);

    if (match.length == 0) {
      const user = await User.findById({ _id: std });

      const search = await ExamPackage.findOne({
        packageUid,
        packageBuyer: { $in: user._id },
      });
      console.log(search);
      if (search) {
        const mong = new Paper({
          packageUid,
          examineeId: user._id,
          examCategory: examCategory,
          packageName: packageName,
        });

        mong.save();

        await User.findOneAndUpdate(
          { _id: user._id },
          { $push: { result: mong._id } },
          { new: true }
        );

        res.status(200).send(mong);
      } else {
        res.status(404).json({ error: "Invalid Entry" });
      }
    } else {
      res.status(202).json({ error: "You have attended  already this exam" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
const myFab = async (req, res) => {
  const { packageUid, std } = req.body;
  console.log(packageUid);
  try {
    const user = await User.findById(std);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const search = await ExamPackage.findOne({
      packageUid,
      packageBuyer: { $in: user._id },
    });

    if (!search) {
      return res.status(404).json({ error: "Package not found for this user" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $push: { myFab: search._id } },
      { new: true }
    );

    const packageWithQuestions = await ExamPackage.findById(
      search._id
    ).populate("qestionList");

    res.status(200).send(packageWithQuestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getFab = async (req, res) => {
  const { email } = req.body;

  try {
    const packageWithQuestions = await User.findOne({ email }).populate({
      path: "myFab",
      populate: {
        path: "qestionList",
        model: "Question",
      },
    });

    if (packageWithQuestions) {
      res.status(200).send(packageWithQuestions);
    } else {
      return res.status(404).json({ error: "Package not found for this user" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const delFab = async (req, res) => {
  const { del, email } = req.body;
  try {
    const search = await User.findOne({ email });
    console.log(search);
    if (search) {
      const user = await User.findByIdAndUpdate(
        { _id: search._id },
        { $pull: { myFab: del } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "Item deleted successfully", user });
    } else {
      res.status(400).json({ message: "Invalid Entry" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error occurred", message: error.message });
  }
};
const createAnswer = async (req, res) => {
  const { packageUid, std, answer } = req.body;

  try {
    const search = await Paper.findOne({
      packageUid: packageUid,
      examineeId: std,
    });
    if (search) {
      const mong = new Answer({
        exampaperid: search.packageUid,
        examineeId: search.examineeId,
        answer,
      });

      mong.save();

      const mp = await Paper.findOneAndUpdate(
        { _id: search._id },
        { $push: { ans: mong._id } },
        { new: true }
      );
      res.status(200).send(mp);
    } else {
      res.status(404).json({ error: "Invalid Entrh" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

const resultPulish = async (req, res) => {
  const { examTrack, examineeId } = req.body;
  try {
    const answers = await Answer.find({ exampaperid: examTrack, examineeId });
    const use = await User.findOne({ _id: examineeId });

    let rightMarks = 0;
    let rightCount = 0;
    let wrongMarks = 0;
    let wrongCount = 0;

    for (const answer of answers) {
      const question = await Question.findOne({
        examTrack: examTrack,
        serial: answer.serial,
      });

      if (question) {
        if (answer.answer === question.rightAnsOne) {
          rightMarks += question.rightMark;
          rightCount += 1;
        } else {
          wrongMarks += question.wrongMark;
          wrongCount += 1;
        }
      }
    }

    const getMark = rightMarks - wrongMarks;
    const percentage = (rightCount / (rightCount + wrongCount)) * 100;

    if (getMark >= 85) {
      comment = "Excellent";
    } else if (getMark >= 70 && getMark <= 84) {
      comment = "Good Shape";
    } else if (getMark >= 60 && getMark <= 69) {
      comment = "Need More Efforts";
    } else if (getMark >= 40 && getMark <= 59) {
      comment = "Try again & Practice more";
    } else {
      comment = "Keep pushing & Try ...";
    }

    const mx = await Paper.findOneAndUpdate(
      { examineeId },
      {
        $set: {
          mark: getMark,
          rightans: rightCount,
          wrongans: wrongCount,
          show: true,
          rightmark: rightMarks,
          wrongmark: wrongMarks,
          percentage: percentage,
          coment: comment,
        },
      },
      { new: true }
    );

    res.status(200).send(mx);
  } catch (error) {
    res.status(500).json({ error: error.code });
  }
};

// const resultPulish = async (req, res) => {
//   const { examTrack, examineeId } = req.body;
//   console.log(examTrack, examineeId);
//   calculateMarks(examTrack, examineeId, res);
// };

const getPaper = async (req, res) => {
  const { puid, id, optn } = req.body;

  try {
    const search = await Paper.findOne({
      packageUid: puid,
      examineeId: id,
    });
    if (search) {
      for (const question in optn) {
        const answer = await optn[question];
        // console.log(parseInt(question.split("-")[1]) + 1, answer);

        const answerDocument = new Answer({
          exampaperid: puid,
          examineeId: id,
          serial: parseInt(question.split("-")[1]) + 1,
          answer: answer,
        });

        answerDocument.save();
        const mp = await Paper.findOneAndUpdate(
          { _id: search._id },
          { $push: { ans: answerDocument._id } },
          { new: true }
        );
      }
      res.send("hello");
    } else {
      res.status(404).json({ error: "Invalid Entrh" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

const myResult = async (req, res) => {
  const { email, cat } = req.body;
  console.log(email);
  try {
    const search = await User.find({ email, role: "Student" }).populate({
      path: "result",
      match: { examCategory: cat },
    });

    if (search.length != 0) {
      res.status(200).json(search);
    } else {
      res.status(400).json({
        error: "NO Result Collection",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Error Occurs" });
  }
};

const successStd = async (req, res) => {
  try {
    const mx = await Paper.find({ percentage: { $gt: 75 } });

    if (mx.length !== 0) {
      console.log(mx.length);
      res.status(200).json({ total: `${mx.length}+` });
    } else {
      console.log(mx.length);
      res.status(200).json({ total: "10+" });
    }
  } catch (error) {
    res.status(500).json({ error: error.code });
  }
};

module.exports = {
  createExamPaper,
  createAnswer,
  resultPulish,
  getPaper,
  myResult,
  myFab,
  getFab,
  delFab,
  successStd,
};
