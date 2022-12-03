const isUserLogedIn = async(req, res, next)=>{
    try {
        if(req.session.user){}
        else{
            return res.redirect("/user/login");
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}

const isUserLogedOut = async (req, res, next) =>{
    try {
        if(req.session.user){
            return res.redirect("/");
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}




module.exports = {
    isUserLogedIn,
    isUserLogedOut,
}