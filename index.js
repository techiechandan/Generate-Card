require('dotenv').config();
const PORT = process.env.PORT || 3000;
const dbName = process.env.dbName;
const dbPass = process.env.dbPassword;
// connecting to database
const mongoose = require('mongoose');

const databasesConnection = async()=>{
    const connectionStatus = await mongoose.connect(`mongodb+srv://chandansmart:${dbPass}@cluster0.xh1r4zv.mongodb.net/${dbName}?retryWrites=true&w=majority`);
    // const connectionStatus = await mongoose.connect("mongodb://127.0.0.1:27017/Id_Card_Generetor_Database");
    if(connectionStatus){
        console.log("connected to database!");
    }else{
        // console.log("not connected to database!");
    }
}
databasesConnection();






// importing bodyParser
const boydparser = require("body-parser");



// importing routes
const appRoutes = require('./routes/appRoute');
const userRoutes = require('./routes/userRoute');
const adminRoutes = require('./routes/adminRoute');



// application
const express = require('express');
const app = express();

//handling static files
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


// parsing data using body parser
app.use(boydparser.urlencoded({extended:true}));
app.use(boydparser.json());




//for generating session
const session = require('express-session');
// const session = require('cookie-session');
const config = require("./config/config");

//const cookieParser = require("cookie-parser");
//const oneDay = 1000 * 60 * 60 * 24;
//app.use(cookieParser());
app.use(session({
    secret: config.sessionSecret,
    saveUninitialized:false,
    //cookie: { maxAge: oneDay },
    resave: false
})); 




//handling routes
app.use('', appRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

app.get('*',(req,res)=>{
    res.redirect('/');
});



//template engine
const ejs = require('ejs');
app.set('view engine','ejs');
app.set('views','views');





//server
app.listen(PORT, (req, res)=>{
    console.log(`listening on port ${PORT}`);
})