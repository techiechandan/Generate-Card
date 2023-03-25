const express = require('express');
const app_route = express.Router();
const app_controller = require('../controllers/appController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname);
    }
});
   

const upload = multer({ 
    storage: storage 
}).single('photo');


// for storing uploaded excel file temporarly
const tempStorage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null,'public/temp/');
  },
  filename(req,file,cb){
    cb(null,file.originalname);
  }
});
const fileUpload = multer({storage: tempStorage}).single('fname');


app_route.get('/',app_controller.index);

app_route.get('/about', app_controller.about);

app_route.get('/id-card-form',auth.isUserLogedIn,app_controller.idCard);

app_route.post('/idcard',/*auth.isUserLogedIn,*/upload,app_controller.qrCode);

app_route.get('/id-card-by-excel',auth.isUserLogedIn,app_controller.Cards);

app_route.post('/idcards',fileUpload,app_controller.generateCards);

app_route.post('/subscription',app_controller.Subscribe);

// app_route.get('/idcard',app_controller.send);
 

module.exports = app_route;