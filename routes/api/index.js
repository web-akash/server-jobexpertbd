const express = require("express");
const _ = express.Router();
const path = require("path");
const app = express();

const {
  regiController,
  verifyEmailController,
  userDelete,
  allUser,
  imgO,
} = require("../../controller/regsitrationController");
const {
  logController,
  resetOtpSendController,
  resetOtpMatchController,
} = require("../../controller/loginController");
const {
  packageCreateController,
  myPackage,
  allPackage,
  myExamList,
  packageBuyer,
  totalExaminee,
  packageTimer,
  packageStatus,
  packageRepost,
  packageDelete,
  categoryWiseTodayExam,
  selectExamByUser,
} = require("../../controller/examPackageController");

// const { examCreate, deleteExam } = require("../../controller/examController");
const {
  createQuestion,
  deleteQuestion,
  packageQuestionList,
  whoCanExam,
} = require("../../controller/questionController");

const {
  responseSSL,
  sslRequest,
  sslSuccess,
  sslNotifiaction,
  sslfail,
  sslCancel,
} = require("../../controller/paymentController");
// pdf image video  start
const imageUp = require("../../controller/imageController");
_.post("/imgupload", imageUp);
const getPdf = require("../../controller/pdfController");
const { deletePdf, getPdfs } = require("../../controller/pdfDelete");
_.post("/upload-pdf", getPdf);
_.get("/upload-pdf", getPdfs);
_.delete("/upload-pdf/:filename", deletePdf);

const {
  createVideo,
  getVideo,
  videoDelete,
} = require("../../controller/videoController");
_.post("/video-upload", createVideo);
_.get("/video-upload", getVideo);
_.delete("/video-upload/:id", videoDelete);
// pdf image video end

//exampaper
const {
  createExamPaper,
  createAnswer,
  resultPulish,
  getPaper,
  myResult,
  myFab,
  getFab,
  delFab,
  successStd,
} = require("../../controller/answerController");
_.post("/exampaper", createExamPaper);
_.post("/answer", createAnswer);
_.post("/result", resultPulish);
_.post("/examinee-paper-push", getPaper);
_.post("/my-result", myResult);
_.post("/myfab", myFab);
_.post("/get-fab", getFab);
_.post("/del-fab", delFab);
_.get("/suu", successStd);

//regi api
_.post("/regi", regiController);
_.post("/emailverification", verifyEmailController);
_.post("/deleteuser", userDelete);
_.post("/deleteuser", userDelete);
_.get("/alluser", allUser);
_.post("/user-img", imgO);

//password api
_.post("/login", logController);
_.post("/resetsent", resetOtpSendController);
_.post("/resetmatch", resetOtpMatchController);

// package api
_.post("/packagecreate", packageCreateController);
_.post("/mypackage", myPackage);
_.post("/exampurchase", packageBuyer);
_.get("/packagelist", allPackage);
_.post("/myexamlist", myExamList);
_.post("/totalexaminee", totalExaminee);
_.post("/timer", packageTimer);
_.post("/packagestatus", packageStatus);
_.post("/packagerepost", packageRepost);
_.post("/packagedelete", packageDelete);
_.post("/categorywise", categoryWiseTodayExam);

_.post("/examtopaper/:id", selectExamByUser);

//exam question Header api
// _.post("/examheader", examCreate);
// _.post("/deleteexam", deleteExam);

//exam question Body api
_.post("/questioncreate", createQuestion);
_.post("/deletequestion", deleteQuestion);
_.post("/examquestion", packageQuestionList);
_.post("/whocanexam", whoCanExam);

// paymentgateway

_.get("/ssl", responseSSL);
_.post("/ssl-request", sslRequest);
_.post("/ssl-payment-success/:tran_id", sslSuccess);

_.post("/ssl-payment-notification/:id", sslNotifiaction);
_.post("/ssl-payment-fail/:tran_id", sslfail);
_.post("/ssl-payment-cancel/:id", sslCancel);

//quiz start

const {
  createQuizHead,
  createQuizBody,
  getAllQuiz,
} = require("../../controller/quizController");
_.post("/create-quiz-head", createQuizHead);
_.post("/create-quiz-body", createQuizBody);
_.get("/all-quiz", getAllQuiz);
// student Story & Comment

const {
  storyCreate,
  storyDelete,
  allStory,
  commentCreate,
  commentDelete,
  allComment,
  ourSuccess,
} = require("../../controller/commentController");
_.post("/story-create", storyCreate);
_.delete("/story-delete/:id", storyDelete);
_.get("/story-all", allStory);
_.get("/comment-all", allComment);
_.get("/our-success", ourSuccess);
_.post("/comment-create", commentCreate);
_.delete("/comment-delete/:id", commentDelete);

// notification

const getNoti = require("../../controller/notiController");
_.get("/notification", getNoti);
module.exports = _;
