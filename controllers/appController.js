//model
const subscriber = require("../models/subsModel");
const user = require('../models/userModel');
const student = require('../models/studentModel');



//importing qrcode
const qr = require("qrcode");


const index = async (req, res) => {
  try {
    if(req.session.user){
      const userMatch = await user.findOne({_id:req.session.user});
      res.render("index", {
        home: "active",
        about: "",
        idcard: "",
        user: userMatch,
        title: "Home | Id Card Generator",
      });
    }else{
      res.render("index", {
        home: "active",
        about: "",
        idcard: "",
        user: req.session.user,
        title: "Home | Id Card Generator",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};




const about = async (req, res) => {
  try {
    if(req.session.user){
      const userMatch = await user.findOne({id:req.session.user});
      res.render("about", {
        home: "",
        about: "active",
        idcard: "",
        user: userMatch,
        title: "About | Id Card Generator",
      });
    }else{
      const userMatch = await user.findOne({id:req.session.user});
      res.render("about", {
        home: "",
        about: "active",
        idcard: "",
        user: req.session.user,
        title: "About | Id Card Generator",
      });
    }
    
  } catch {
    console.log(error.message);
  }
};



const idCard = async (req, res) => {
  try {
    const userMatch = await user.findOne({id:req.session.user});
    res.render("idCardForm", {
      home: "",
      about: "",
      idcard: "active",
      user: userMatch,
      title: "Generate-Card | Id Card Generator",
    });
  } catch (error) {
    console.log(error.message);
  }
};



const qrCode = async (req, res, next) => {
  try {
    const studentMatch = await student.findOne({email:req.body.email});
    if(studentMatch){
      res.redirect('/id-card-form');
    }else{
      const studentData = new student({ 
        photo: req.file.filename,
        name:  req.body.fname+' '+req.body.lname,
        birth:  req.body.birthDate,
        bGroup:  req.body.bloodGroup,
        course:  req.body.course,
        status:  req.body.status,
        startYear:  req.body.addYear,
        endYear:  req.body.SeComYear,
        email:  req.body.email,
        contact:  req.body.mobNo,
        rollNo:  req.body.rollNo,
        GuardianName:  req.body.guardianName,
        District: req.body.district,
        Village: req.body.village,
        PinCode: req.body.pincode,
        GeneratedBy:req.session.user
      });
      const newStudent = await studentData.save();
      if(newStudent){
        let data;
        data =
          "Name: " + newStudent.name +"\n" +
          "D.O.B: " + newStudent.birth +"\n" +
          "BloodGroup: " + newStudent.bGroup+"\n"+
          "Course: " + newStudent.course+"\n"+
          "Session: " + newStudent.startYear+" - "+ newStudent.endYear+"\n"+
          "Email: " + newStudent.email+"\n"+
          "Mobile No : " + newStudent.contact+"\n"+
          "Roll No: " + newStudent.rollNo+"\n"+
          "Guardian's Name: " + newStudent.GuardianName+"\n"+
          "Address: " + newStudent.Village+","+newStudent.District+","+newStudent.PinCode;
    
        // if (data.length === 0) res.send("Empty data!");
        if (data.length === 0){
          res.send("Empty data!");
        }else{
          const userMatch = await user.findOne({id:req.session.user});
          qr.toDataURL(data, (err, src) => {
            if (err) {
              res.send("Failed to generate qr code, please try again.");
            } else {
              res.render("qrcode1", {
                home: "",
                about: "",
                idcard: "active",
                src: src,
                user: userMatch,
                title: "Generate | Id Card Generator",
                std: newStudent,
              });
            }
          });
        }
      }else{
        redirect('/id-card-form');
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};



// const send = async (req, res)=>{
//   try {
//     res.redirect('/id-card-form');
//   } catch (error) {
//     console.log(error.message);
//   }
// }


// for subscription
const Subscribe = async (req, res) => {
  try {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const userEmail = req.body.email;
    const userMatch = await user.findOne({id:req.session.user});
    if (!userEmail.match(emailRegex)) {
      res.render("subsThanks", {
        home: "",
        about: "",
        idcard: "",
        user: userMatch,
        title: "Subscription | Id Card Generator",
        message: "Failed to subscribe!",
      });
    } else {
      const emailMatch = await subscriber.findOne({ email: userEmail });

      if (emailMatch) {
        res.render("subsThanks", {
          home: "",
          about: "",
          idcard: "",
          user: userMatch,
          title: "Subscription | Id Card Generator",
          message: "Failed to subscribe!",
        });
      } else {

        const subscriberData = await new subscriber({
          email: userEmail,
        });
        const newSubscriber = await subscriberData.save();

        if (newSubscriber) {
          res.render("subsThanks", {
            home: "",
            about: "",
            idcard: "",
            user: userMatch,
            title: "Subscription | Id Card Generator",
            message: "Thanks for your subscription!",
          });
        } else {
          res.render("subsThanks", {
            home: "",
            about: "",
            idcard: "",
            user: userMatch,
            title: "Subscription | Id Card Generator",
            message: "Failed to subscribe!",
          });
        }
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};




const invalidRoute = async (req, res) => {
  try {
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  index,
  about,
  idCard,
  qrCode,
  Subscribe,
  invalidRoute,
  // send,
};
