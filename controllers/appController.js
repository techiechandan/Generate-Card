//model
const subscriber = require("../models/subsModel");
const user = require('../models/userModel');
const student = require('../models/studentModel');
//importing additional packegs
const fs = require("fs");
const XLSX =require("xlsx");



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
      res.render("about", {
        home: "",
        about: "active",
        idcard: "",
        user: req.session.user,
        title: "About | Id Card Generator",
      });
    } 
  } catch(error) {
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
        GeneratedBy: await req.session.user,
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




// Card by Excel File
const Cards = async(req,res)=>{
  try{
    const userMatch = await user.findOne({id:req.session.user});
    res.render("idCardFormExcel", {
      home: "",
      about: "",
      idcard: "active",
      user: userMatch,
      title: "Generate-Card | Id Card Generator",
    });   
  }catch(error){
    console.log(error.message);
  }
}





const generateCards = async (req,res)=>{
  try{
    const StudentDataList = [];
    const StudentQrCodeList = [];
    const imageArray = [];
    if(req.file){
      // reading excel file
      const file = XLSX.readFile(req.file.path);
      if(file){
        for(let i = 0; i<file.SheetNames.length; i++){
          const tempFile = XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
          for(let i = 0; i< tempFile.length; i++){
            const email = tempFile[i].email;
            const studentMatch = await student.findOne({email:email});
            
            if(!studentMatch){
              //writing photo
              const imagename = `image${Date.now()}.jpg`;
              fs.readFile(tempFile[i].photo,(err,data)=>{
                try {
                  if(err){
                    throw err;
                  }  
                  fs.writeFileSync(`public/uploads/${imagename}`, data);
                }catch (error) {
                  console.log(error.message);
                }
              });
              imageArray.push(imagename);
              const tempDob = new Date(tempFile[i].birth);
              const dob = `${tempDob.getFullYear()}-0${tempDob.getMonth()+1}-${tempDob.getDate()}`;
              StudentDataList.push({
                photo:imagename,
                name:tempFile[i].name,
                birth:dob,
                bGroup:tempFile[i].bGroup,
                course:tempFile[i].course,
                status:tempFile[i].status,
                startYear:tempFile[i].startYear,
                endYear:tempFile[i].endYear,
                email:tempFile[i].email,
                contact:tempFile[i].contact,
                rollNo:tempFile[i].rollNo,
                GuardianName:tempFile[i].GuardianName,
                District:tempFile[i].District,
                Village:tempFile[i].Village,
                PinCode:tempFile[i].PinCode,
                GeneratedBy:await req.session.user
              });

              let data;
              data =
                "Name: " + tempFile[i].name +"\n" +
                "D.O.B: " + tempFile[i].birth +"\n" +
                "BloodGroup: " + tempFile[i].bGroup+"\n"+
                "Course: " + tempFile[i].course+"\n"+
                "Session: " + tempFile[i].startYear+" - "+ tempFile[i].endYear+"\n"+
                "Email: " + tempFile[i].email+"\n"+
                "Mobile No : " + tempFile[i].contact+"\n"+
                "Roll No: " + tempFile[i].rollNo+"\n"+
                "Guardian's Name: " + tempFile[i].GuardianName+"\n"+
                "Address: " + tempFile[i].Village+","+tempFile[i].District+","+tempFile[i].PinCode;


              if (data.length === 0){
                res.send("Empty data!");
              }else{
                qr.toDataURL(data, (err, src) => {
                  if (err) {
                    res.send("Failed to generate qr code, please try again.");
                  } else {
                    StudentQrCodeList.push(src);
                  }
                });
              }
            }
          }
        }

        //deleting the stored excel file....
        if(file){
          fs.unlink("public/temp/"+ req.file.filename,(err)=>{
            if(err){
              console.log("file not deleted!");
            }
          });
        }
      }

      const userMatch = await user.findOne({id:req.session.user});
      if(StudentDataList.length !== 0){
        const StudentsLists = await student.insertMany(StudentDataList);
        if(StudentsLists){
          res.render("qrcode2", {
            home: "",
            about: "",
            idcard: "active",
            src: StudentQrCodeList,
            user: userMatch,
            title: "Generate | Id Card Generator",
            std: StudentsLists,
          });
        }
      }else{
        // deleting stored images
        for(let i=0; i< imageArray.length; i++){
          fs.unlink("public/temp/"+ imageArray[i],(err)=>{
            if(err){
              console.log("stored image not deleted!");
            }
          });
        }

        res.render("idCardFormExcel", {
          home: "",
          about: "",
          idcard: "active",
          user: userMatch,
          title: "Generate-Card | Id Card Generator",
        }); 
      }
    }
  }catch(error){
    console.log(error.message);
  }
}



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
  Cards,
  generateCards,
  // send,
};
