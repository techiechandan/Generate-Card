const isAdminLogedIn = async(req, res, next)=>{
    try {
        if(req.session.user_id){}
        else{
            return res.redirect("/admin");
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}

const isAdminLogedOut = async (req, res, next) =>{
    try {
        if(req.session.user_id){
            return res.redirect("/admin/dashboard/");
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    isAdminLogedIn,
    isAdminLogedOut,
}