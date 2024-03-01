const fileUpload = require("express").Router()
const e = require("express")
const { json } = require("express")
const fs = require('fs')
const multer = require("multer")
const { apiResponse } = require("./apiResponse")
const { insertData, insertDataEmail, updateDataUsingAny } = require("./mongobd")
const userRequestCheck = require("./userRequestCheck")
const checkTokenFileupload = require("./checkTokenFileupload")
const { path } = require("./config")
userRequestCheck
const axios = require('axios').default
//const fetch = require("node-fetch")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    console.log(uniqueSuffix);
    const filename = file.fieldname + '-' + uniqueSuffix+"-"+file.originalname;
    console.log(filename);
    cb(null, filename )
  }
})

const upload = multer({ storage: storage })

fileUpload.use(json())

fileUpload.post('/upload', upload.single("file"), (req, res) => {
  console.log(req.headers);
  res.json(req.file)
})
fileUpload.use("/photos" ,e.static('uploads'))

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'temp')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const filename = file.fieldname + '-' + uniqueSuffix+"-"+file.originalname;
    cb(null, filename )
  }
})

const upload1 = multer({ storage: storage1 })
fileUpload.post('/facecheck',upload1.single("file"), async (req, res) => {
  
  const {pat, email, username } = req.body;
  try {
    var formData = {
      image_url1: path+req.file.path, //change it like signup api "/home/rmtomal/nodejs_projects/varsity_showcase/"
      image_url2: pat
    };
    console.log("name "+req.body.username);
    const response = await axios.post('http://127.0.0.1:5000/compare_images',
      formData)
      console.log(response.data.result);
      if (response.data.result>=1) {
        const now = new Date();
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
  
        const formattedTime = now.toLocaleTimeString('en-US', timeOptions);
        console.log(formattedTime);
  
  
        const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  
        const formattedDate = now.toLocaleDateString('en-US', dateOptions);
        console.log(formattedDate);
        const dada = {
          email: email,
          name: username,
          time: formattedTime,
          date: formattedDate 
        }
        const i = await insertDataEmail(dada);
        await updateDataUsingAny({getAttandence: false},{userMail: email}, "usersInfo")
        if (!i.error) {
          res.status(200).json(apiResponse("Done", false, 200))
        }else{
          res.status(400).json(apiResponse("Server error,", true, 400))
        }
      }else{
        console.log("error");
        res.status(402).json(apiResponse("Face Not Match", true, 402))
      }
  } catch (error) {
    console.log(error);
    res.status(400).json(apiResponse("server error", false, 400));
  }
  
})

module.exports = fileUpload