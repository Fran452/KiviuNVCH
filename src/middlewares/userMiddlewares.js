const userMiddlewares = {
    
    userRegister: (req,res,next) => {
        if(req.session.user != undefined || req.url == "/login"){
            next();
        }else{
            return res.redirect("/login");
        }
    },

    tieneVista: (req,res,next) => {
        if(req.session.user != undefined || req.url == "/login"){
            next();
        }else{
            return res.redirect("/login");
        }
    },
 

}

module.exports = userMiddlewares