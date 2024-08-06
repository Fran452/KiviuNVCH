const dataBaseSQL = require("../databaseSQL/models");
const {Sequelize, DATE} = require('sequelize');

const path = require("path");

var apirest = {
    status: 0,
    codeError : "",
    objeto: {}
}

const bcrypt = require("bcrypt");

const funcionesGenericas = require("../funcionesGenerales");
const indicadores = require("../databaseSQL/models/indicadores");

const controlador = {

    index: async (req,res) => {
        try{
            
        }
        catch(error){

        }
    },

    newindicador: async (req,res) => {
        try{
            let empleadoResponsable = await dataBaseSQL.empleados.findOne(
                {
                    where: {
                        mail : req.body.responsable
                    },
                }
            );

            let empleadoSuplente = await dataBaseSQL.empleados.findOne(
                {
                    where: {
                        mail : req.body.empleadoSuplente
                    },
                }
            );
            if (empleadoResponsable === null){
                res.json({error : 10, errorDetalle: "El correo del responsable no existe."});
                return 1;
            }else if(empleadoSuplente === null){
                res.json({error : 10, errorDetalle: "El correo del responsable suplente no existe."});
                return 1;
            }else{
                let fechaActual = new date();
                let fechaRecordatorio = funcionesGenericas.generarRecordatorio(fechaActual,req.body.tipo_recordartorio); 
                if(fechaRecordatorio == 1){
                    res.json({error : 99, errorDetalle: "El tipo de fecha seleccionado no existe"});
                    return 1;
                }
                let indicador = await dataBaseSQL.indicadores.create({
                    fk_area:req.body.fk_area,
                    fk_responsable:empleadoResponsable,
                    fk_responsable_sumplente:empleadoSuplente,
                    nombre_indicador:req.body.nombre_indicador,
                    detalles_metrica:req.body.detalles_metrica,
                    tipo_recordartorio:req.body.tipo_recordartorio,
                    fecha_del_recodatorio:fechaRecordatorio,
                });
                res.json({error :0, errorDetalle: "", objeto:indicador});
                return 0
            }
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    viewIndicadores: async (req,res) => {
        try{
            let indicadores;
            if(req.body.user.puesto < 1){
                indicadores = await dataBaseSQL.tareas.findAll({
                    where: {
                    },
                    attributes: ['id_indicador','nombre_indicador','detalles_metrica','tipo_recordartorio'],
                    include: [
                        {association : "Areas",attributes: ['id_area','nombre_del_Area']},
                        {association : "Empleados",attributes: ['nombre','mail']},
                        {association : "ResponsableSuplente",attributes: ['nombre','mail']}
                    ]
                });

            }else{
                indicadores = await dataBaseSQL.tareas.findAll({
                    where: {
                       fk_area: req.body.user.area,
                    },
                    attributes: ['id_indicador','nombre_indicador','detalles_metrica','tipo_recordartorio'],
                    include: [
                        {association : "Areas",attributes: ['id_area','nombre_del_Area']},
                        {association : "Empleados",attributes: ['nombre','mail']},
                        {association : "ResponsableSuplente",attributes: ['nombre','mail']}
                    ]
                });
            };            
            res.json({error :0, errorDetalle: "", objeto:tareas});            
            return 0;
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },
    
    viewDetallesIndicadores: async (req,res) => {
        try{
            
        }
        catch(error){

        }
    },

    editIndicadores: async (req,res) => {
        try{
            let empleadoResponsable;
            let empleadoSuplente;
            if(req.body.responsable){
                empleadoResponsable = await dataBaseSQL.empleados.findOne(
                    {
                        where: {
                            mail : req.body.responsable
                        },
                    }
                );
    
                
            }else{
                empleadoResponsable = req.body.tarea.fk_responsable;
            }
            if(req.body.empleadoSuplente){
                empleadoSuplente = await dataBaseSQL.empleados.findOne(
                    {
                        where: {
                            mail : req.body.empleadoSuplente
                        },
                    }
                );
            }else{
                empleadoSuplente = req.body.tarea.fk_responsable_sumplente;
            }

            let indicadorModificado = await dataBaseSQL.tareas.update({
                fk_area:req.body.user.fk_area,
                fk_responsable:empleadoResponsable,
                fk_responsable_sumplente:empleadoSuplente,
                nombre_indicador:req.body.nombre_indicador,
                detalles_metrica:req.body.detalles_metrica,
                tipo_recordartorio:req.body.tipo_recordartorio,
            },{
                where:{
                    id_indicador : req.body.idIndicador
                }
            });
            res.json({error: 0, errorDetalle:"",objeto:indicadorModificado});
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    deleteIndicadores: async (req,res) => {
        try{
            
        }
        catch(error){

        }
    },

    newMetrica: async (req,res) => {
        try{
            
        }
        catch(error){

        }
    },

    editMetrica: async (req,res) => {
        try{
            
        }
        catch(error){

        }
    },

    ultimasTresMetricas: async (req,res) => {
        try{
            
        }
        catch(error){

        }
    },
}



module.exports = controlador;