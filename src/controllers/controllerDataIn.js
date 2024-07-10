const dataBaseSQL = require("../databaseSQL/models");
const path = require("path");

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

    agregarLog:  async (req,res) => {},

    modificarLog:  async (req,res) => {},

    mostrarUltimos3Logs: async (req,res) => {}

}

module.exports = controlador;