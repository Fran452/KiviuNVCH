const userMiddlewares = {
    /*
    userFrancisco: (req,res,next) => {
        req.session.user = {
            id: 4,
            nombre: 'Francisco Lema',
            area: 1,
            puesto: 3,
            mail: 'franciscolemacr@gmail.com'
        }
        next();
    },
    */
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

    passwordFront: () => {
        if(true){

        }
    }

}

module.exports = userMiddlewares