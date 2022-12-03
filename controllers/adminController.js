//database
const mongoose = require('mongoose');
const user = require('../models/userModel');
const students = require('..//models/studentModel');
const fs = require('fs');


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
        res.render('admin/cards',{title:"IDCG | Adminstration",cards:cardList})
    } catch (error) {
        console.log(error.message);
    }
}

const deleteCard = async(req,res)=>{
    try {
        const id = await req.query.id;
        const cardData = await students.findOne({_id:id});
        fs.unlink('public/uploads/' + cardData.photo, (err) => {
            if (err) {
                res.send('Please try after some time!');
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
    getupdateCard,
    updateCard,
    deleteCard,
}