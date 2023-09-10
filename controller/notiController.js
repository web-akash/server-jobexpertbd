const express = require("express");
const app = express();

const Notification = require("../model/notiModel");

const getNoti = async (req, res) => {
  try {

    const noti = await Notification.find({});
    console.log(noti);

    if (noti.length !== 0) {
      res.status(200).send(noti);
    } else {
      res.status(404).josn({ error: "no Notification" });

   
    }
  } catch (error) {
    res.status(500).json({ error: error.cdoe });
  }
};

module.exports = getNoti;
