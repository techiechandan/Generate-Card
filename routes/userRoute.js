const express = require('express');

const user_route = express.Router();
const user_controller = require("../controllers/userController");



const auth = require("../middleware/auth");


user_route.get('/register',auth.isUserLogedOut,user_controller.register);
user_route.post('/register',user_controller.userRegister);
user_route.get('/login',auth.isUserLogedOut,user_controller.login);
user_route.post('/login',user_controller.userLogin);
user_route.get('/logout',auth.isUserLogedIn,user_controller.userLogOut);




user_route.get('*',(req,res)=>{
    res.redirect('/');
});
 


module.exports = user_route;