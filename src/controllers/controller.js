const dataBaseSQL = require("../databaseSQL/models");
const path = require("path");
const jwt = require("jsonwebtoken");

const baseDeDatos = {
    empleados : path.join(__dirname, "../database/db_user.json"),
    area      : path.join(__dirname, "../database/db_areas.json"),
    tareas    : path.join(__dirname, "../database/db_tareas.json"),
    view      : path.join(__dirname, "../database/db_view.json"),
    okr       : path.join(__dirname, "../database/db_okrs.json")
}

const bcrypt = require("bcrypt");

const funcionesGenericas = require("../funcionesGenerales");

const controlador = {

    index: async (req,res) => {
            //let areas = funcionesGenericas.archivoJSON(baseDeDatos.area); 
            let area = await dataBaseSQL.areas.findAll();
            res.render("home.ejs",{areas:area,usuario:req.session.user});
    },

    bi: async (req,res) => {
        //let area = funcionesGenericas.archivoJSON(baseDeDatos.area).filter(area => area.id == req.params.area)[0]
        let area = await dataBaseSQL.areas.findByPk(req.params.area);
        if(area.id_area == req.session.user.area){
            res.render("powerBi.ejs",{area:area});
        }else{
            res.render("not-permiss.ejs",{});
        }
       
    },

    planesAcción:  async (req,res) => {
        if(req.session.user.view == 0){
            res.render("configPlanesDeAccion.ejs");
        }else{  
            res.redirect("/plan-accion")
        }
        res.render("not-permiss.ejs");
    },

    planesAcciónFuction:  async (req,res) => {
        res.redirect("/home");
    },


    planesAcciónView: async (req,res) => {
        if(req.session.user.view == 0){
            res.redirect("/plan-accion-config");
            return 0
        }
        
        let view = funcionesGenericas.archivoJSON(baseDeDatos.view).filter(vista => vista.id == req.session.user.view)[0]
        let tareas = funcionesGenericas.archivoJSON(baseDeDatos.tareas);
        res.render("planesAcción",{view,tareas});
        
        
        return 0
    },

    agregarTarea:  async (req,res) => { 
    
    },  
    
    modificarTarea: async (req,res) => { 

    },  

    eliminarTarea: async (req,res) => { 

    },  
    
    /*
    registerView:  async (req,res) => {

    },
    
    registerFuction:  async (req,res) => { 

    },
    */

    datInView:  async (req,res) => {
        let input = {
            error : {}
        };

        let okrPerson = funcionesGenericas.archivoJSON(baseDeDatos.okr).filter(okr => okr.fkEmpleado == req.session.id )[0];
        if(okrPerson == undefined){
            input.datosPreSeleccionados = {};
        }else{
            input.datosPreSeleccionados = okrPerson;
        }
        res.render("dataIn.ejs",{input});
        return input;
    },
    
    datINFuction:  async (req,res) => {
        let error = false;
        let mailEmpresariales = funcionesGenericas.archivoJSON(baseDeDatos.empleados).map(empleado => empleado.mail);
        let input = {
            error : {},
            datosPreSeleccionados : {}
        };

        for(let key in  req.body){
            if(req.body[key] == ''){
                error = true;
                input.error[key] = "El campo debe estar completo";
            }else{
                switch (key){
                    case "responsable":
                        console.log("responsable");
                        if (!mailEmpresariales.includes(req.body[key])){
                            console.log("Error responsable");
                            error = true;
                            input.error[key] = "Mail inexistente";
                        };
                        break;
                    case "resposableSuplente":
                        if (!mailEmpresariales.includes(req.body[key])){
                            error = true;
                            input.error[key] = "Mail inexistente";
                        };
                        break;
                    case "fechaDeCarga":
                        break;
                    case "horaDeCarga":
                        break;
                    default:
                        continue;
                }
                 
            }
        }
        if (error){
            res.render("okr.ejs",{input});
            return 1;
        }else{
            res.render("okrEnviado.ejs");
            return 0;
        }
    },

    asistenteIa:  async (req,res) => {
        console.log("entre a ia");
        res.render("asistenteIa.ejs");
    },

    okr:  async (req,res) => {
        console.log("okr");
        res.render("okr.ejs");
    },

    login: async (req,res) => {
        console.log("login");
        if(req.session.user != undefined){
            res.redirect("/home");
        }else{
            res.render("login.ejs",{error:undefined});
        }

    },

    /*
    loginFuction :  async (req,res) => {
        console.log("entre al functio del log");
        let empleados = funcionesGenericas.archivoJSON(baseDeDatos.empleados);
        let empleado = empleados.filter(empleado => empleado.mail == req.body.user);

        if(empleado[0] == undefined){
            res.render("login.ejs",{error:"no existe el mail"});
        }else{
            if(bcrypt.compareSync(req.body.pass,empleado[0].contraseña)){
                console.log("Contraseña correcta");
                req.session.user = {
                    id : empleado[0].id,
                    nombre : empleado[0].nombre,
                    area : empleado[0].area,
                    socursal : empleado[0].socursal,
                    view : empleado[0].view,
                    mail : empleado[0].mail
                }
                res.redirect("/home");
            }else{
                res.render("login.ejs",{error:"contraseña incorrecta"});
                return {error:"contraseña incorrecta"}
            }

        }
    }*/

        loginFuction :  async (req,res) => { 
            let fechaActual = new Date();
            let empleados = await dataBaseSQL.empleados.findOne(
                {
                    where: {
                        mail : req.body.user
                    },
                }
            );
            
            /*
            let indicadores = await dataBaseSQL.indicadores.findOne(
                {
                    where: {
                        recordartorio  : `${fechaActual.getFullYear()}-${fechaActual.getMonth()}-${fechaActual.getDate()}`
                    },
                }
            );*/
    
            // if(indicadores[0] != undefined){
            //     console.log("hay mails");
            //     console.log(indicador[0]);
            // };
    
            if(empleados == null){
                apirest = {
                    status: 10,
                    codeError : "no existe el mail",
                    objeto: {}
                }
                const token = jwt.sign({apirest}, "Stack",{
                    expiresIn: '3m'
                })
                res.json(token);

                // return apirest = {
                //     status: 10,
                //     codeError : "no existe el mail",
                //     objeto: {}
                // };
            }else{
                if(bcrypt.compareSync(req.body.pass,empleados.password)){
                    req.session.user = {
                        id : empleados.id_empleado,
                        nombre : empleados.nombre,
                        area : empleados.fk_area,
                        puesto: empleados.fk_Puesto,
                        socursal : empleados.socursal,
                        mail : empleados.mail,
                    }
                    console.log(req.session.user);
                    //
                    apirest = {
                        status: 0,
                        codeError : "",
                        objeto: req.session.user
                    }
                    const token = jwt.sign({apirest}, "Stack",{
                        expiresIn: '3m'
                    })
                    res.json(token);
                    //
                    return apirest;
                }else{
                    apirest = {
                        status: 10,
                        codeError : "Contraseña incorrecta",
                        objeto: {}
                    };
                    const token = jwt.sign({apirest}, "Stack",{
                        expiresIn: '3m'
                    })
                    res.json(token);
                }
            }
        }
}



module.exports = controlador;