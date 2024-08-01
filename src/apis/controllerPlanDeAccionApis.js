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
    /* CRUD De Proyecto */

    viewProyecto: async (req,res) => {
        try{
            proyectos = await dataBaseSQL.proyectos.findAll({
                where: {
                    fk_area : req.body.user.area,
                    ver:1
                },
            });
            res.json({erro:0,ErrorDetalle:"",objeto:proyectos});

        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    addProyecto: async (req,res) => {
        try{

            let proyecto = await dataBaseSQL.proyectos.create({
                fk_area : req.body.user.area,
                nombre : req.body.nombre,
                detalles : req.body.detalles,
                ver:1
            });
            res.json({error :0, errorDetalle: "", objeto:proyecto});
            return 0
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    modProyecto: async (req,res) => {
        try{
            let proyecto = await dataBaseSQL.proyectos.update({
                nombre : req.body.nombre,
                detalles : req.body.detalles,
            },{
                where:{
                    id_proyecto: req.body.idProyecto
                }
            });
            res.json({error :0, errorDetalle: "", objeto:proyecto});
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    deleteProyecto: async (req,res) => {
        try{
            let proyecto = await dataBaseSQL.proyectos.update({
                ver:0
            },{
                where:{
                    id_proyecto: req.body.idProyecto
                }
            });
            res.json({error :0, errorDetalle: "", objeto:proyecto});
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },
    /* CRUD De Tareas */

    // Ver tareas
    viewTareas: async (req,res) => {
        try{
            let tareas;
            if(req.body.user.puesto < 1){
                tareas = await dataBaseSQL.tareas.findAll({
                    where: {
                        mostrar : 1,
                        fk_proyecto : req.body.idProyecto
                    },
                    attributes: ["id_tarea","nombre","estado","prioridad","fecha_inicio","fecha_final","notas","progreso",],
                    include: [
                        {association : "Areas",attributes: ['id_area','nombre_del_Area']},
                        {association : "Empleados",attributes: ['nombre','mail']},
                        {association : "AreasApollo",attributes: ['id_area','nombre_del_Area']}
                    ]
                });

            }else{
                tareas = await dataBaseSQL.tareas.findAll({
                    where: {
                        fk_area: req.body.user.area,
                        mostrar : 1,
                        fk_proyecto : req.body.idProyecto
                    },
                    attributes: ["id_tarea","nombre","estado","prioridad","fecha_inicio","fecha_final","notas","progreso",],
                    include: [
                        {association : "Areas",attributes: ['id_area','nombre_del_Area']},
                        {association : "Empleados",attributes: ['nombre','mail']},
                        {association : "AreasApollo",attributes: ['id_area','nombre_del_Area']}
                        ]
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

    // Ver tareas por persona
    addTarea:  async (req,res) => { 
        try {
            
        }
        catch(error){

        }
    },    

    // Agregar tareas 
    addTarea:  async (req,res) => { 
        try{
            let fechaActua = new DATE ;
            let fechaDeLaTarea = new DATE(req.body.fechaInicio);
            let empleadoAsignado = await dataBaseSQL.empleados.findOne(
                {
                    where: {
                        mail : req.body.empleado_asignado
                    },
                }
            );

            if (empleadoAsignado === null){
                res.json({error : 10, errorDetalle: "El correo del responsable no existe."});
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
                    fecha_inicio : req.body.fechaInicio,
                    fecha_final : req.body.fechaFinal,
                    notas : req.body.notas,
                    fk_area_apoyo: req.body.areaApoyo,
                    progreso:req.body.progreso,
                    mostrar : 1,
                    fk_proyecto: req.body.idProyecto
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
    
    // Modificar tareas 
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
                estado : req.body.estado,
                prioridad : req.body.prioridad,
                fecha_inicio : req.body.fechaInicio,
                fecha_final : req.body.fechaFinal,
                notas : req.body.notas,
                fk_area_apoyo: req.body.areaApoyo,
                progreso:req.body.progreso,
                fk_proyecto: req.body.idProyecto
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

    // Eliminar tareas 
    deleteTarea: async (req,res) => { 
        try{
             let tareaModificada = await dataBaseSQL.tareas.update({
                mostrar : 0,
            },{
                where:{
                    id_tarea : req.body.idTarea
                }
            });
            res.json({error : 0, errorDetalle: "", objeto:tareaModificada});   
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },  

}



module.exports = controlador;