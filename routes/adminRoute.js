const express = require('express');
const admin_route = express.Router();
const admin_controller = require('../controllers/adminController');
const auth = require('../middleware/adminAuth');


admin_route.get('/',auth.isAdminLogedOut,admin_controller.login);
admin_route.post('/',admin_controller.adminVerify);
admin_route.get('/dashboard',auth.isAdminLogedIn,admin_controller.dashboard);
admin_route.get('/logout',auth.isAdminLogedIn,admin_controller.logout);
admin_route.get('/users',auth.isAdminLogedIn,admin_controller.users);
admin_route.get('/users/update-user',auth.isAdminLogedIn,admin_controller.getupdateUser);
admin_route.post('/users/update-user',auth.isAdminLogedIn,admin_controller.updateUser);
admin_route.get('/users/delete-user',auth.isAdminLogedIn,admin_controller.deleteUser);
admin_route.get('/cards',auth.isAdminLogedIn,admin_controller.cards);
admin_route.get('/cards/update-card',auth.isAdminLogedIn,admin_controller.getupdateCard);
admin_route.post('/cards/update-card',auth.isAdminLogedIn,admin_controller.updateCard);
admin_route.get('/cards/delete-card',auth.isAdminLogedIn,admin_controller.deleteCard);

admin_route.get('*',(req,res)=>{
    res.redirect('/admin');
});
 

module.exports = admin_route