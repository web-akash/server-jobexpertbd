const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const Story = require("../model/stroyModel");
const Comment = require("../model/commentModel");
const Paper = require("../model/examPaperModel");
const User = require("../model/userModel");

const storyCreate = async (req, res) => {
  const { story, email, url, name } = req.body;

  try {
    const mong = new Story({
      story,
      email,
      url,
      name,
    });
    mong.save();
    res.status(201).send(mong);
    console.log(mong);
  } catch (error) {
    res.status(500).json({ error: error.code });
  }
};

const storyDelete = async (req, res) => {
  const storyId = req.params.id;
  const email = req.query.email;
  console.log("st", email);
  console.log("st", storyId);

  try {
    const story = await Story.findById({ _id: storyId });

    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    if (story.email !== email) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this story" });
    }

    await Story.findByIdAndDelete({ _id: storyId });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const allStory = async (req, res) => {
  try {
    const allGet = await Story.find({});

    res.status(200).send(allGet);
  } catch (error) {
    res.status(500).json({ error: error.cod });
  }
};

const commentCreate = async (req, res) => {
  const { comment, email, url, name } = req.body;

  try {
    const mong = new Comment({
      comment,
      email,
      url,
      name,
    });
    mong.save();
    res.status(201).send(mong);
  } catch (error) {
    res.status(500).json({ error: error.code });
  }
};

const commentDelete = async (req, res) => {
  const storyId = req.params.id;
  const email = req.query.email;
  console.log("com", storyId);
  console.log("com", email);

  try {
    const comment = await Comment.findById({ _id: storyId });

    if (!comment) {
      return res.status(404).json({ error: "Story not found" });
    }

    if (comment.email !== email) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this story" });
    }

    await Comment.findByIdAndDelete({ _id: storyId });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const allComment = async (req, res) => {
  try {
    const allGet = await Comment.find({});

    res.status(200).send(allGet);
  } catch (error) {
    res.status(500).json({ error: error.cod });
  }
};

const ourSuccess = async (req, res) => {
  try {
    const papers = await Paper.find({ percentage: { $gte: 70 } });

    if (papers.length > 0) {
      const examineeIds = [...new Set(papers.map((paper) => paper.examineeId))];

      const users = await User.find({ _id: { $in: examineeIds } });

      const successList = users.map((user) => ({
        name: user.name,
        avatar: user.avatar[0],
      }));

      res.status(200).json(successList);
    } else {
      res
        .status(404)
        .json({ message: "No users with a percentage of 80 or higher found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Usage:
// Add the route for ourSuccess to your Express application
// app.get("/our-success", ourSuccess);

module.exports = {
  storyCreate,
  storyDelete,
  allStory,
  commentCreate,
  commentDelete,
  allComment,
  ourSuccess,
};
