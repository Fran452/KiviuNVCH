const dataBaseSQL = require("../database/models");
const {Sequelize, DATE} = require('sequelize');

const path = require("path");
const jwt = require("jsonwebtoken");

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
    totalUser : async (req,res) => { 
        try{            
            let empleado = await dataBaseSQL.empleados.findOne(
                {
                    where: {
                        mail : req.body.user.mail
                    },
                }
            );

            if(empleado.fk_puesto == 1){
                let totalEmpleados = await dataBaseSQL.empleados.findAll(
                    {
                        where: {
                            fk_area : req.body.user.area
                        },
                    }
                );
                res.status(200).json({error :0, errorDetalle: "", objeto:totalEmpleados});
                return 0;
            }else{
                res.status(450).json({error :99, errorDetalle: "Sin permisos para registrar.", objeto:{}});
                return 1;
            }
            
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({errorGeneral: error, error : codeError, errorDetalle: error.message });   
            return 1;
        }
    },

    loginFuction :  async (req,res) => { 
        try{
            let empleados = await dataBaseSQL.empleados.findAll(
                {
                    where: {
                        mail : req.body.user
                    },
                }
            );

        
            if(empleados == null){
                apirest = {
                    status: 10,
                    codeError : "no existe el mail",
                    objeto: {}
                }
                const token = jwt.sign({apirest}, "Stack", {
                    expiresIn: '24h'
                })
                res.json(token)
                //
                return apirest = {
                    status: 10,
                    codeError : "no existe el mail",
                    objeto: {}
                };
            }else{
                let empleado = empleados.find(empleado.id_Auth0 == req.body.id);
                if(empleado == undefined){
                    empleado = empleados.find(empleado.id_Auth0 == undefined);

                    await dataBase.empleados.update({
                        id_Auth0 : req.body.id
                    },{
                        where:{
                            id_empleado : empleado.id_empleado
                        }
                    });
                }
                req.session.user = {
                    id : empleado.id_empleado,
                    nombre : empleado.nombre,
                    area : empleado.fk_area,
                    puesto: empleado.fk_puesto,
                    mail : empleado.mail
                }

                console.log(req.session.user);
                
                apirest = {
                    status: 0,
                    codeError : "",
                    objeto: req.session.user
                }

                const token = jwt.sign({apirest}, "Stack",{
                    expiresIn: '24h'
                })
                res.json(token);
            
                return apirest;

            }
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({errorGeneral: error, error : codeError, errorDetalle: error.message });   
            return 1;
        }
        
    },
    
    registerFuction:  async (req,res) => { 

        try{
            let empleados = await dataBaseSQL.empleados.findOne(
                {
                    where: {
                        mail : req.body.user.mail
                    },
                }
            );

            if(empleados.fk_puesto == 1){
                let usuario = await dataBase.empleados.create({
                    fk_area             : 1,
                    fk_puesto           : req.body.puesto,
                    nombre              : req.body.nombre,
                    abreviatura         : req.body.abrev,
                    mail                : req.body.mail,
                    estado              : 1,
                });
    
                res.status(200).json({error :0, errorDetalle: "", objeto:usuario});
                return 0;
            }else{
                res.status(450).json({error :99, errorDetalle: "Sin permisos para registrar.", objeto:{}});
                return 1;
            }
           
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({errorGeneral: error, error : codeError, errorDetalle: error.message });   
            return 1;
        }

    },

    deleteEmpleado:  async (req,res) => { 
        try{
            let empleados = await dataBaseSQL.empleados.findOne(
                {
                    where: {
                        mail : req.body.user.mail
                    },
                }
            );
            if(empleados.fk_puesto == 1){
                let usuario = await dataBase.empleados.update({
                    estado              : 0,
                },{
                    where:{
                        id_empleado : req.body.idEmpleado
                    }
                });
    
                res.status(200).json({error :0, errorDetalle: "", objeto:usuario});
                return 0;
            }else{
                res.status(450).json({error :99, errorDetalle: "Sin permisos para eliminar.", objeto:{}});
            }
           
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({errorGeneral: error, error : codeError, errorDetalle: error.message });   
            return 1;
        }

    },
    
}



module.exports = controlador;