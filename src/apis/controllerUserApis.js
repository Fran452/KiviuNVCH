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
    /*
    registerView:  async (req,res) => {

    },
    
    registerFuction:  async (req,res) => { 

    },
    */
}



module.exports = controlador;