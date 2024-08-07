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
                    mostrar: 1
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
                        mostrar : 1
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
                       mostrar : 1,
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
            };

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
            };

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
            let indicadorEliminado = await dataBaseSQL.tareas.update({
                mostrar : 0,
            },{
                where:{
                    id_indicador : req.body.idIndicador
                }
            });
            res.json({error: 0, errorDetalle:"",objeto:indicadorEliminado});
            
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    newMetrica: async (req,res) => {
        try{
            const ahora = new Date();
            const fechaFormateada = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}`;  
            const horaFormateada = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}:${String(ahora.getSeconds()).padStart(2, '0')}`;

            let metrica = await dataBaseSQL.metrica.create({
                fk_indicador:req.body.fk_indicador,
                dato_metrica:req.body.dato_metrica,
                fecha_Metrica:fechaFormateada,
                hora_Metrica:horaFormateada,
                log_de_usuario:req.body.user.id
            });
            res.json({error :0, errorDetalle: "", objeto:metrica});
            return 0;
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    editMetrica: async (req,res) => {
        try{
            let metricarModificado = await dataBaseSQL.tareas.update({
                dato_metrica:req.body.dato_metrica,
                fecha_Metrica:req.body.fecha_Metrica,
                hora_Metrica:req.body.hora_Metrica,
                log_de_usuario:req.body.log_de_usuario
            },{
                where:{
                    id_metricas : req.body.idMetricas
                }
            });
            res.json({error :0, errorDetalle: "", objeto:metricarModificado});
            return 0;
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    ultimasTresMetricas: async (req,res) => {
        try{
            let metricas = await dataBaseSQL.tareas.findAll({
                where: {
                   fk_indicador:req.body.fkIndicador
                },
                limit: 3,
                order: [['fecha_Metrica', 'DESC']],
                include: [{association : "log_de_usuario",attributes: ['nombre','mail']}]
            });
            res.json({error :0, errorDetalle: "", objeto:metricas});
            return 0;
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },
}



module.exports = controlador;