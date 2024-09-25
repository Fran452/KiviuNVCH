const dataBaseSQL = require("../database/models");
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
            let area = await dataBaseSQL.areas.findAll();
            let api = {status: 0, codeError:"", objeto: area };
            res.json(api);
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});
        }
    },

    bi: async (req,res) => {
        try{
            let area
            let BiArea
            let nombreArea
            
            area = await dataBaseSQL.areas.findByPk(req.body.area);
            BiArea = area.power_Bi;
            nombreArea = area.nombre_del_Area;
            res.json( {status: 0, codeError:"", objeto: {BiArea,nombreArea} })
            return {status: 0, codeError:"", objeto: {BiArea,nombreArea} };

        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});
        }
       
    }  

}



module.exports = controlador;