//database
const mongoose = require('mongoose');
const user = require('../models/userModel');
const students = require('..//models/studentModel');
const fs = require('fs');

//importing qrcode
const qr = require("qrcode");


// generating secure password
const bcrypt = require('bcrypt');



const login = async (req, res) => {
    try {
        res.render('admin/login');
    } catch (error) {
        console.log(error.message);
    }
}


const adminVerify = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const adminMatch = await user.findOne({ email: email});
        if(adminMatch){
            const passwordMatch = await bcrypt.compare(password,adminMatch.password);
            if(passwordMatch){
                if(adminMatch.is_admin === 1){
                    req.session.user_id = adminMatch._id;
                    res.redirect('/admin/dashboard/');
                }else{
                    res.render('admin/login',{message:"Invalid Email & Password!"});
                }
            }else{
                res.render('admin/login',{message:"Invalid Email & Password!"});
            }
        }else{
            res.render('admin/login',{message:"Invalid Email & Password!"});
        }
    } catch (error) {
        console.log(error.message);
    }
}


const dashboard = async (req, res) => {
    try {
        res.render('admin/dashboard',{title:"IDCG | Adminstration"});
    } catch (error) {
        console.log(error.message);
    }
}

const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/admin');
    } catch (error) {
        console.log(error.message);
    }
}


const users = async (req, res) => {
    try {
        const usersData = await user.find();
        res.render('admin/users',{title:"IDCG | Adminstration",user:usersData})
    } catch (error) {
        console.log(error.message);
    }
}


const getupdateUser = async(req,res)=>{
    try {
        const id = await req.query.id;
        // console.log(typeof id);
        if(req.session.user_id === id){
            res.render('admin/404',{title:"IDCG | Adminstration",message:"Changes can't be performed on current user!"});
        }else{
            const userdata = await user.findOne({_id:id});
            if(userdata){
                res.render('admin/update',{title:"IDCG | Adminstration",user:userdata});
            }else{
                res.render('admin/404',{title:"IDCG | Adminstration",message:"Sorry, user not found!"});
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

const updateUser = async(req,res)=>{
    try {
        const id = await req.query.id;
        if(req.session.user_id === id){
            res.render('admin/404',{title:"IDCG | Adminstration",message:"Chanages can't be performed on current user!"});
        }else{
            const userdata = await user.findByIdAndUpdate({ _id:id },{ $set:{name:req.body.FlName,email:req.body.email,contact:req.body.MobNo,is_admin:req.body.type,is_verified:req.body.status}});
            res.redirect('/admin/users');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const deleteUser = async(req,res)=>{
    try {
        const id = await req.query.id;
        if(req.session.user_id === id){
            res.render('admin/404',{title:"IDCG | Adminstration",message:"Chanages can't be performed on current user!"});
        }else{
            const userdata = await user.deleteOne({_id:id});
            res.redirect('/admin/users');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const cards = async(req,res)=>{
    try {
        const cardList = await students.find();
        res.render('admin/cards',{title:"IDCG | Adminstration",cards:cardList})
    } catch (error) {
        console.log(error.message);
    }
}
const searchCards = async(req,res)=>{
    try {
        let queryItem = {};
        if(req.body.fName){
            queryItem.name = req.body.fName;
        }if(req.body.fEmail){
            queryItem.email = req.body.fEmail;
        }if(req.body.fBloodGroup && req.body.fBloodGroup !== 'null'){
            queryItem.bGroup = req.body.fBloodGroup;
        }if(req.body.fCourse && req.body.fCourse !== 'null'){
            queryItem.course = req.body.fCourse;
        }
        const cardList = await students.find(queryItem);
        res.render('admin/cards',{title:"IDCG | Adminstration",cards:cardList})
    } catch (error) {
        console.log(error.message);
    }
}
const getupdateCard = async(req,res)=>{
    try {
        const id = await req.query.id;
        const cardData = await students.findOne({_id:id});
        res.render('admin/updateCards',{title:"IDCG | Adminstration",card:cardData});
    } catch (error) {
        console.log(error.message);
    }
}

const updateCard = async(req,res)=>{
    try {
        const cardList = await students.find();
        const id = await req.query.id;
        const studentData = await students.findOne({_id:id});
        let studentPhoto;

        // this is for if user will not upload any photo at the time of updation
        if(typeof req.file != 'undefined'){
            // deleting the older photo for the sutdent 
            fs.unlink('public/uploads/' + studentData.photo, (err) => {
                if (err) {
                    res.send('Image not found, please try after some time!');
                }
            });
            studentPhoto = req.file.filename;
        }else{
            studentPhoto = studentData.photo;
        }
        
        
        const cardData = await students.findByIdAndUpdate({ _id:id },{
            photo: studentPhoto,
            name:  req.body.fname +' '+ req.body.lname,
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

        if(cardData){
            res.render('admin/cards',{title:"IDCG | Adminstration",cards:cardList});
        }else{
            res.send("Card Details not updated, please try again later");
        }
    } catch (error) {
        console.log(error.message);
    }
}


const newCard = async(req, res) => {
    try{
        const student = await students.findOne({_id:req.query.id});
        data =
          "Name: " + student.name +"\n" +
          "D.O.B: " + student.birth +"\n" +
          "BloodGroup: " + student.bGroup+"\n"+
          "Course: " + student.course+"\n"+
          "Session: " + student.startYear+" - "+ student.endYear+"\n"+
          "Email: " + student.email+"\n"+
          "Mobile No : " + student.contact+"\n"+
          "Roll No: " + student.rollNo+"\n"+
          "Guardian's Name: " + student.GuardianName+"\n"+
          "Address: " + student.Village+","+student.District+","+student.PinCode;
        if(data.length === 0){
            res.send("Failed to get student data to generate card!")
        }else{
            qr.toDataURL(data, (err, src) =>{
                if(err){
                    res.send("Failed to generate qr code right now!")
                }else{
                    res.render("admin/qrcode",{title:"IDCG | Adminstration",std:student,src:src})
                }
            });
        }
    }catch(error){
        console.log(error.message);
    }
}






const deleteCard = async(req,res)=>{
    try {
        const id = await req.query.id;
        const cardData = await students.findOne({_id:id});
        fs.unlink('public/uploads/' + cardData.photo, (err) => {
            if (err) {
                res.send('Image not found, please try after some time!');
            }
        });
        const DeleteCardData = await students.deleteOne({_id:id});
        const cardList = await students.find();
        res.render('admin/cards',{title:"IDCG | Adminstration",cards:cardList});
       
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    login,
    adminVerify,
    dashboard,
    logout,
    users,
    getupdateUser,
    updateUser,
    deleteUser,
    cards,
    searchCards,
    getupdateCard,
    updateCard,
    newCard,
    deleteCard,
}