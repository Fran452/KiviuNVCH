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
            let area = await dataBaseSQL.areas.findAll();
            area = area.map(area => {return {id_area: area.id_area,nombre_del_Area: area.nombre_del_Area}});
            let api = {status: 0, codeError:"", objeto:{areas:area,usuario:req.body.user} };
            console.log( "entre a home");
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
            if(req.body.user.area == req.body.area){
                area = await dataBaseSQL.areas.findByPk(req.body.area);
                BiArea = area.power_Bi;
                nombreArea = area.nombre_del_Area;
                res.json( {status: 0, codeError:"", objeto: {BiArea,nombreArea} })
                return {status: 0, codeError:"", objeto: {BiArea,nombreArea} };
            }else{
                if(req.body.user.puesto == 0 || req.body.user.puesto == 1){
                    area = await dataBaseSQL.areas.findByPk(req.body.area);
                    BiArea = area.power_Bi;
                    nombreArea = area.nombre_del_Area;
                    res.json({status: 0, codeError:"", objeto: {BiArea,nombreArea} })
                    return {status: 0, codeError:"", objeto: {BiArea,nombreArea} };
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
       
    }  

}



module.exports = controlador;