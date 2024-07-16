const dataBaseSQL = require("../databaseSQL/models");
const {Sequelize, DATE} = require('sequelize');

const path = require("path");

const baseDeDatos = {
    empleados : path.join(__dirname, "../database/db_user.json"),
    area      : path.join(__dirname, "../database/db_areas.json"),
    tareas    : path.join(__dirname, "../database/db_tareas.json"),
    view      : path.join(__dirname, "../database/db_view.json"),
    okr       : path.join(__dirname, "../database/db_okrs.json")
}

var apirest = {
    status: 0,
    codeError : "",
    objeto: {}
}

const bcrypt = require("bcrypt");

const funcionesGenericas = require("../funcionesGenerales");

const controlador = {

    index: async (req,res) => {
        try{
            //let areas = funcionesGenericas.archivoJSON(baseDeDatos.area);
            let area = await dataBaseSQL.areas.findAll();
            area = area.map(area => {return {id_area: area.id_area,nombre_del_Area: area.nombre_del_Area}});
            console.log("home");
            let api = {status: 0, codeError:"", objeto:{areas:area,usuario:req.session.user} };
            res.json(api);
            //res.render("home.ejs",{areas:area,usuario:req.session.user});
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});
        }
    },

    bi: async (req,res) => {
        try{
            if(req.session.user.area == req.params.area){
                let area = await dataBaseSQL.areas.findByPk(req.params.area);
                let BIArea = area.power_Bi;
                res.json( {status: 0, codeError:"", objeto: BIArea })
                return {status: 0, codeError:"", objeto: BIArea };
            }else{
                if(req.session.user.puesto == 0 || req.session.user.puesto == 1){
                    let area = await dataBaseSQL.areas.findByPk(req.params.area);
                    let BIArea = area.power_Bi;
                    res.json({status: 0, codeError:"", objeto: BIArea })
                    return {status: 0, codeError:"", objeto: BIArea };
                }else{
                    res.json({status: 99, codeError:"No tiene permisos", objeto: "" })
                    return {status: 99, codeError:"No tiene permisos", objeto: "" };
                }
            }
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});
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
        try{
            let fechaActua = new DATE
            let usuario = "fran@mail.com"
            let empleadoAsignado = await dataBaseSQL.empleados.findOne(
                {
                    where: {
                        mail : usuario
                    },
                }
            );

            if (isNull(empleado)){
                res.json({error : 10, errorDetalle: "empleado in dataBase not exist"});
                return 1;
            }else if(fecha_inicio > fechaActua){
                res.json({error : 99, errorDetalle: "fecha_inicio is greater than the current"});
                return 1;
            }
            let tarea = await dataBaseSQL.tareas.create({
                fk_empleado_asignado : usuario.id_empleado,
                fk_area : req.session.user.area,
                nombre : req.body.nombre,
                rango : req.bod.rango,
                prioridad : req.body.prioridad,
                fecha_inicio : req.body.fecha_inicio,
                fecha_final : req.body.fecha_final,
                notas : req.body.notas,
            });

            res.json({error :0, errorDetalle: "", objeto:tarea});
            return 0
        }

        catch(error){

            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }       
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
    
            if(empleados == null){
                res.json({
                    status: 10,
                    codeError : "no existe el mail",
                    objeto: {}
                })
                return apirest = {
                    status: 10,
                    codeError : "no existe el mail",
                    objeto: {}
                };
            }else{
                if(bcrypt.compareSync(req.body.pass,empleados.password)){
                    req.session.user = {
                        id : empleados.id_empleado,
                        nombre : empleados.nombre,
                        area : empleados.fk_area,
                        puesto: empleados.fk_Puesto,
                        mail : empleados.mail
                    }
                    console.log(req.session.user);
                    apirest = {
                        status: 0,
                        codeError : "",
                        objeto: req.session.user
                    }
                    res.json(apirest);
                    return apirest;
                }else{
                     pirest = {
                        status: 10,
                        codeError : "Contraseña incorrecta",
                        objeto: {}
                    };
                    res.json(apirest);
                }
            }
        }
}



module.exports = controlador;