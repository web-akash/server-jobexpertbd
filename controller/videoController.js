const express = require("express");
const app = express();

const User = require("../model/userModel");
const Video = require("../model/videoModel");

const createVideo = async (req, res) => {
  const { email, subject, text, title, videoUrl } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const video = new Video({
      teacherName: user.name,
      userId: user._id,
      subject: subject,
      videoUrl: videoUrl,
      text: text,
      title: title,
    });

    await video.save();

    user.video.push(video._id);

    await user.save();

    res.status(200).json({ message: "Upload", video: user.video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getVideo = async (req, res) => {
  try {
    const allVideo = await Video.find({});

    if (allVideo.length != 0) {
      res.status(201).send(allVideo);
    } else {
      res.status(404).json({ error: "No File" });
    }
  } catch (error) {
    res.status(500).json({ error: error.code });
  }
};

const videoDelete = async (req, res) => {
    const { id } = req.params;
  try {
    const vd = await Video.findById({ _id: id });
    if (vd) {
      await Video.findByIdAndDelete({ _id: vd._id });
      await User.updateMany(
        { video: vd._id },
        { $pull: { video: vd._id } },
        { new: true }
      );
      res.status(200).json({message:"Delete success"});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = { createVideo, getVideo ,videoDelete};
