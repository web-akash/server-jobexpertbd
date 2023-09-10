const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const QuizBody = require("../model/quizBodyModel");
const QuizHead = require("../model/quizHeadModel");

const createQuizHead = async (req, res) => {
  const { teacherId, teacherName } = req.body;

  try {
    const user = await User.findById({ _id: teacherId });

    if (user) {
      const mongo = new QuizHead({
        teacherName,
        teacherId: user._id,
      });
      mongo.save();

      const how = await User.findOneAndUpdate(
        { _id: user._id },
        { $push: { quiz: mongo._id } },
        { new: true }
      );
      res.status(200).send(how);
    } else {
      res.status(404).json({ error: "User Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.massage });
  }
};

const createQuizBody = async (req, res) => {
  const {
    quizHead,
    whatIsTheQuestion,
    optionA,
    optionB,
    optionC,
    optionD,
    rightAnsOne,
  } = req.body;
  try {
    const user = await QuizHead.findById({ _id: quizHead });
    if (user) {
      const mongo = new QuizBody({
        quizHead: user._id,
        whatIsTheQuestion,
        optionA,
        optionB,
        optionC,
        optionD,
        rightAnsOne,
      });
      mongo.save();

      const how = await QuizHead.findOneAndUpdate(
        { _id: user._id },
        { $push: { quizBody: mongo._id } },
        { new: true }
      );
      res.status(200).send(how);
    } else {
      res.status(404).json({ error: "User Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.massage });
  }
};

const getAllQuiz = async (req, res) => {
  try {
    const search = await QuizHead.find({}).populate("quizBody");
    console.log(search);

    if (search.length != 0) {
      res.status(200).send(search);
    } else {
      res.status(404).json({ error: "Quiz Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.massage });
  }
};
module.exports = {
  createQuizHead,
  createQuizBody,
  getAllQuiz,
};
