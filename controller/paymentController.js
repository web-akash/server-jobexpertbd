const express = require("express");
const { ObjectId } = require("mongodb");
const app = express();
const SSLCommerzPayment = require("sslcommerz-lts");
const ExamPackage = require("../model/examPackage");
const User = require("../model/userModel");
const emailV = require("../utils/emailVerfy");

const responseSSL = async (req, res) => {
  res.status(200).json({
    message: "Welcome to sslcommerz app",
    url: `${process.env.ROOT}/ssl-request`,
  });
};

const tran_id = new ObjectId().toString();
const sslRequest = async (req, res) => {
  const { nid, name, email, packageUid, packageName, examCategory } = req.body;
  const pack = await ExamPackage.findOne({ packageUid });

  const dataa = {
    total_amount: parseInt(pack?.packageFee),
    currency: "BDT",
    tran_id: tran_id,
    success_url: `http://localhost:5000/jobExpert/api/v1/ssl-payment-success/${tran_id}`,
    fail_url: `http://localhost:5000/jobExpert/api/v1/ssl-payment-fail/${tran_id}`,
    cancel_url: `${process.env.ROOT}/ssl-payment-cancel/${tran_id}`,
    shipping_method: "No",
    product_name: packageName,
    product_category: examCategory,
    product_profile: "hello",
    cus_name: name,
    cus_email: email,
    cus_add1: nid,
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    multi_card_name: "mastercard",
    value_a: "ref001_A",
    value_b: "ref002_B",
    value_c: "ref003_C",
    value_d: "ref004_D",
    ipn_url: `${process.env.ROOT}/ssl-payment-notification/${tran_id}`,
  };

  const sslcommerz = new SSLCommerzPayment(
    process.env.STORE_ID,
    process.env.STORE_PASSWORD,
    false
  );
  console.log("ami:", tran_id);
  await sslcommerz.init(dataa).then(async (data) => {
    console.log(data);

    if (data?.GatewayPageURL) {
      const mx = await User.findOneAndUpdate(
        { email },
        { $set: { orderId: tran_id, orderPk: pack._id } },
        { new: true }
      );
      console.log(mx);
      res.status(200).json({ url: data?.GatewayPageURL });
    } else {
      res.status(400).json({
        message: "Session was not successful",
      });
    }
  });
};
const sslSuccess = async (req, res) => {
  const tran_id = req.params.tran_id;
  console.log("ami tran", tran_id);
  try {
    const mx = await User.findOne({ orderId: tran_id });

    if (!mx) {
      return res.redirect(`http://localhost:5173/jobexpart/fail/${tran_id}`);
    }

    await User.findByIdAndUpdate(
      { _id: mx._id },
      { $set: { orderId: "", orderPk: "" }, $push: { myExam: mx.orderPk } },
      { new: true }
    );
    const sub = "purchase success";
    const code = mx.orderPk;
    const email = mx.email;
    emailV(email, code, sub);
    res.redirect(
      `http://localhost:5173/jobexpart/payment/${tran_id}?myExam=${mx.orderPk}`
    );
  } catch (error) {
    console.error(error);
    return res.redirect(`http://localhost:5173/jobexpart/fail/${tran_id}`);
  }
};

const sslNotifiaction = async (req, res) => {
  return res.status(200).json({
    data: req.body,
    message: "Payment notification",
  });
};

const sslfail = async (req, res) => {
  const tran_id = req.params.tran_id;
  const mx = await User.findOne({ orderId: tran_id });
  await User.findByIdAndUpdate(
    { _id: mx._id },
    { $set: { orderId: "", orderPk: "" } },
    { new: true }
  );

  return res.redirect(`http://localhost:5173/jobexpart/fail/${tran_id}`);
};

const sslCancel = async (req, res) => {
  const mx = await User.findOne({ orderId: req.params.id });
  await User.findByIdAndUpdate(
    { _id: mx._id },
    { $set: { orderId: "", orderPk: "" } },
    { new: true }
  );

  return res.status(200).json({
    data: req.body,
    message: "Payment cancelled",
  });
};
module.exports = {
  responseSSL,
  sslRequest,
  sslSuccess,
  sslNotifiaction,
  sslfail,
  sslCancel,
};
