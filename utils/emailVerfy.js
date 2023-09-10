const nodemailer = require("nodemailer");

async function emailV(email, code, sub,text) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });
  let info = await transporter.sendMail({
    from: "Lost & Found", // sender address
    to: email, // list of receivers
    subject: sub, // Subject line
    text: text, // plain text body
    html: `<button  >${code}</button>`, // html body
  });
}

module.exports = emailV;
