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

    planesAcciónView: async (req,res) => {
        try{
            let tareas;
            console.log(req.body);
            if(req.body.user.puesto < 1){
                tareas = await dataBaseSQL.tareas.findAll({
                    where: {
                        mostrar : 1
                    },
                    include: [{association : "Areas"},{association : "Empleados"},{association : "AreasApollo"}]
                });

            }else{
                tareas = await dataBaseSQL.tareas.findAll({
                    where: {
                        fk_area: req.body.user.area,
                        mostrar : 1
                    },
                    include: [{association : "Areas"},{association : "Empleados"},{association : "AreasApollo"}]
                });
            }
            
            
            res.json({error :0, errorDetalle: "", objeto:tareas});            
            return 0;
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    addTarea:  async (req,res) => { 
        try{
            let fechaActua = new DATE ;
            let fechaDeLaTarea = new DATE(req.body.fecha_inicio);
            let empleadoAsignado = await dataBaseSQL.empleados.findOne(
                {
                    where: {
                        mail : req.body.empleado_asignado
                    },
                }
            );

            if (isNull(empleadoAsignado)){
                res.json({error : 10, errorDetalle: "empleado in dataBase not exist"});
                return 1;
            }else if(fechaDeLaTarea > fechaActua){
                res.json({error : 99, errorDetalle: "fecha_inicio is greater than the current"});
                return 1;
            }else{
                let tarea = await dataBaseSQL.tareas.create({
                    fk_empleado_asignado : empleadoAsignado.id_empleado,
                    fk_area : req.body.user.area,
                    nombre : req.body.nombre,
                    estado : req.body.estado,
                    prioridad : req.body.prioridad,
                    fecha_inicio : fechaDeLaTarea,
                    fecha_final : req.body.fecha_final,
                    notas : req.body.notas,
                    fk_area_apoyo: req.body.areaApoyo,
                    mostrar : 1 
                });
                res.json({error :0, errorDetalle: "", objeto:tarea});
                return 0
            }
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }       
    },  
    
    modTarea: async (req,res) => { 
        try{
            let empleadoAsignado;
            if(req.body.empleado_asignado){
                empleadoAsignado = await dataBaseSQL.empleados.findOne(
                    {
                        where: {
                            mail : req.body.empleado_asignado
                        },
                    }
                );
            }else{
                empleadoAsignado = req.body.tarea.fk_empleado_asignado;
            }

            let tareaModificada = await dataBaseSQL.tareas.update({
                fk_empleado_asignado : empleadoAsignado.id_empleado,
                fk_area : req.body.user.area,
                nombre : req.body.nombre,
                rango : req.bod.rango,
                prioridad : req.body.prioridad,
                fecha_inicio : fechaDeLaTarea,
                fecha_final : req.body.fecha_final,
                notas : req.body.notas,
            },{
                where:{
                    id_tarea : req.body.idTarea
                }
            });
            res.json({error: 0, errorDetalle:"",objeto:tareaModificada});
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },  

    deleteTarea: async (req,res) => { 
        try{
             let tareaModificada = await dataBaseSQL.tareas.update({
                show : 1,
            },{
                where:{
                    id_tarea : req.body.idTarea
                }
            });
            res.json({error : 0, errorDetalle: "",objeto:tareaModificada});   
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },  

}



module.exports = controlador;