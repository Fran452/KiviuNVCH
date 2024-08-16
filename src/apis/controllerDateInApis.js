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
                let fechaActual = new Date();
                let fechaRecordatorio = funcionesGenericas.generarRecordatorio(fechaActual,req.body.tipo_recordartorio); 
                
                if(fechaRecordatorio == 1){
                    res.json({error : 99, errorDetalle: "El tipo de fecha seleccionado no existe"});
                    return 1;
                }
                let indicador = await dataBaseSQL.indicadores.create({
                    fk_area:                    req.body.user.area,
                    fk_responsable:             empleadoResponsable.id_empleado,
                    fk_responsable_suplente:   empleadoSuplente.id_empleado,
                    nombre_indicador:           req.body.nombre_indicador,
                    detalles_metrica:           req.body.detalles_metrica,
                    tipo_recordartorio:         req.body.tipo_recordartorio,
                    fecha_del_recodatorio:      fechaRecordatorio,
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
                indicadores = await dataBaseSQL.indicadores.findAll({
                    where: {
                        mostrar : 1
                    },
                    attributes: ['id_indicador','nombre_indicador','detalles_metrica','tipo_recordartorio'],
                    include: [
                        {association : "Areas",attributes: ['id_area','nombre_del_Area']},
                        {association : "Empleados",attributes: ['id_empleado','nombre','mail']},
                        {association : "ResponsableSuplente",attributes: ['id_empleado','nombre','mail']}
                    ]
                });

            }else{
                indicadores = await dataBaseSQL.indicadores.findAll({
                    where: {
                       mostrar : 1,
                       fk_area: req.body.user.area,
                    },
                    attributes: ['id_indicador','nombre_indicador','detalles_metrica','tipo_recordartorio','fecha_del_recodatorio'],
                    include: [
                        {association : "Areas",attributes: ['id_area','nombre_del_Area']},
                        {association : "Empleados",attributes: ['id_empleado','nombre','mail']},
                        {association : "ResponsableSuplente",attributes: ['id_empleado','nombre','mail']}
                    ]
                });
            };            
            indicadores.map(indicador => {
                indicador.dataValues.color = funcionesGenericas.asignarColor(indicador.fecha_del_recodatorio)
                return indicador
            });

            res.json({error :0, errorDetalle: "", objeto:indicadores});            
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

            if(req.body.responsable != req.body.indicador.Empleados.mail){
                empleadoResponsable = await dataBaseSQL.empleados.findOne(
                    {
                        where: {
                            mail : req.body.responsable
                        },
                        attributes: ['id_empleado']
                    }
                );
    
                
            }else{
                console.log(req.body.indicador.Empleados)
                empleadoResponsable = req.body.indicador.Empleados.id_empleado;
                
            };

            if(req.body.empleadoSuplente != req.body.indicador.ResponsableSuplente.mail){
                empleadoSuplente = await dataBaseSQL.empleados.findOne(
                    {
                        where: {
                            mail : req.body.empleadoSuplente,
                        },
                        attributes: ['id_empleado']
                    }
                );
            }else{
                console.log(req.body.indicador.ResponsableSuplente)
                empleadoSuplente = req.body.indicador.ResponsableSuplente.id_empleado;
            };
            let indicadorModificado = await dataBaseSQL.indicadores.update({
                fk_area:                    req.body.user.area,
                fk_responsable:             empleadoResponsable.id_empleado,
                fk_responsable_suplente:   empleadoSuplente.id_empleado,
                nombre_indicador:           req.body.nombre_indicador,
                detalles_metrica:           req.body.detalles_metrica,
                tipo_recordartorio:         req.body.tipo_recordartorio,
            },{
                where:{
                    id_indicador : req.body.indicador.id_indicador
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
            let indicadorEliminado = await dataBaseSQL.indicadores.update({
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
            let metrica = await dataBaseSQL.metricas.create({
                fk_indicador:   req.body.fk_indicador,
                dato_metrica:   req.body.dato_metrica,
                fecha_Metrica:  ahora,
                log_de_usuario: req.body.user.id
            });

            let indicadorDeLaMetrica = await dataBaseSQL.indicadores.findOne({
                where:{
                    id_indicador: req.body.fk_indicador
                }
            });

            let fechaActual = new Date();
            let fechaRecordatorio = funcionesGenericas.generarRecordatorio(fechaActual,indicadorDeLaMetrica.dataValues.tipo_recordartorio); 
            
            let indicadorModificado = await dataBaseSQL.indicadores.update({
                fecha_del_recodatorio:  fechaRecordatorio,
            },{
                where:{
                    id_indicador : req.body.fk_indicador
                }
            });
            
            res.json({error :0, errorDetalle: "", objeto:metrica});
            return 0;
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message, objeto : {}});   
            return 1;
        }
    },

    editMetrica: async (req,res) => {
        try{
            const ahora = new Date();

            let metricarModificado = await dataBaseSQL.metricas.update({
                dato_metrica:   req.body.dato_metrica,
                fecha_Metrica:  ahora,
                log_de_usuario: req.body.user.id
            },{
                where:{
                    id_metrica: req.body.idMetrica
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
            let metricas = await dataBaseSQL.metricas.findAll({
                where: {
                   fk_indicador:req.body.fkIndicador
                },
                limit: 3,
                order: [['fecha_Metrica', 'DESC']],
                include: [{association : "Empleados",attributes: ['nombre','mail']}]
            });
            res.json({error :0, errorDetalle: "", objeto:metricas});
            return 0;
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message,objeto : {}});   
            return 1;
        }
    },
}



module.exports = controlador;