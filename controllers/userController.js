//model
const user = require('../models/userModel');
// generating secure password
const bcrypt = require('bcrypt');



const SecurePasswordManager = async (password) => {
    
    try {
        const securPass = await bcrypt.hash(password,10);
        return securPass;
    } catch (error) {
        console.log(error.message);
    }
}


// For registration page
const register = async (req, res)=>{
    try {
        res.render('user/register',{home:"",about:"",idcard:"",user:req.session.user,title:"Register | Id Card Generator"});
      
    }catch(error){
        console.log(error.message);
    }
}




// For Login page
const login = async (req, res) => {
    try {
        // const userdata = await user.findOne({_id:req.session.user});
        res.render('user/login',{home:"",about:"",idcard:"",user:req.session.user,title:"Login | Id Card Generator"});
        
    }catch(error){
        console.log(error.message);
    }
}


// For Registration
const userRegister = async (req, res) => {
    try {
        let firstname = req.body.fname;
        let lastname = req.body.lname;
        let email = req.body.email;
        let contact =req.body.MobNo;
        let password = req.body.password;
        let cpassword = req.body.cpassword;
        //Required Regular Expression
        const nameRegex = /^[a-zA-Z ]{2,30}$/;
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;
        const mobNoRegx = /^[0-9]{10}$/;

        if(!firstname.match(nameRegex)){
            
            res.render('user/register',{home:"",about:"",idcard:"",user:req.session.user,title:"User-Register | Id Card Generator",message:"Please enter valid name!"});

        }
        else if(!lastname.match(nameRegex)){
            res.render('user/register',{home:"",about:"",idcard:"",user:req.session.user,title:"User-Register | Id Card Generator",message:"Please enter valid name!"});

        }
        else if (!email.match(emailRegex)){
            res.render('user/register',{home:"",about:"",idcard:"",user:req.session.user,title:"User-Register | Id Card Generator",message:"Please enter valid email!"});

        }
        else if (!contact.match(mobNoRegx)){
            res.render('user/register',{home:"",about:"",idcard:"",user:req.session.user,title:"User-Register | Id Card Generator",message:"Please enter valid mobile number!"});

        }
        else if(!password.match(passRegex)){
            res.render('user/register',{home:"",about:"",idcard:"",user:req.session.user,title:"User-Register | Id Card Generator",message:"Please enter valid password!"});

        }
        else if (password !== cpassword){
            res.render('user/register',{home:"",about:"",idcard:"",user:req.session.user,title:"User-Register | Id Card Generator",message:"Password do not match!"});
        }
        else{
            const userMatch = await user.findOne({email:email});
            if(userMatch){
                res.render('user/register',{home:"",about:"",idcard:"",user:req.session.user,title:"User-Register | Id Card Generator",message:"This email has already been used, Please try again with other email!"});
            }
            else{
                //getting secure password
                const securePassword = await SecurePasswordManager(password);

                const userData = new user({
                    name: firstname + ' ' + lastname,
                    email: email,
                    contact:contact,
                    password: securePassword            
                })
                const newUser = await userData.save();
                if(newUser){
                    res.redirect("/user/login");
                }else{
                    res.render('user/register',{home:"",about:"",idcard:"",user:req.session.user,title:"User-Register | Id Card Generator",message:"Registration failed!"});
                }
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}





// For Login
const userLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userMatch = await user.findOne({email:email});
        if(userMatch){
            const passMatch = await bcrypt.compare(password, userMatch.password);
            if( passMatch ){
                if(userMatch.is_verified === 1){
                    req.session.user = userMatch._id;
                    // req.session.save();
                    res.redirect("/");
                }else{
                    res.render('user/login',{home:"",about:"",idcard:"",user:req.session.user, title:"User-Login | Id Card Generator",message:"User not verified!"});
                }
            }
            else{
                res.render('user/login',{home:"",about:"",idcard:"",user:req.session.user, title:"User-Login | Id Card Generator",message:"Invalid Email & password!"});
            }
        }
        else{
            res.render('user/login',{home:"",about:"",idcard:"",user:req.session.user, title:"User-Login | Id Card Generator",message:"Invalid Email & password!"});
        }
    } catch (error) {
        console.log(error.message);
    }
}



const userLogOut = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect("/");
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    register,
    login,
    userRegister,
    userLogin,
    userLogOut,
}