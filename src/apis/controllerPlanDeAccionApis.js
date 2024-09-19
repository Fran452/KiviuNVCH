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

    /* CRUD De Ciclos */
    viewCiclos: async (req,res) => {
        try{
            let ciclos = await dataBaseSQL.sequelize.query(
                `SELECT Ciclos.*, MIN(tar.fecha_inicio) as fecha_inicio_tareas,
                    CASE
                        WHEN COUNT(tar.id_tarea) = COUNT(CASE WHEN tar.progreso_tarea = 100 THEN 1 END)
                        THEN MAX(tar.fecha_final)
                        ELSE NULL
                    END AS fecha_final_tareas
                 FROM (
                    SELECT Tareas.*, COALESCE(AVG(Subtareas.avance),0) as progreso_tarea,
                        CASE
                            WHEN COUNT(Subtareas.id_sub_tarea) = COUNT(CASE WHEN Subtareas.avance = 100 THEN 1 END)
                            THEN MAX(Subtareas.fecha_final)
                            ELSE NULL
                        END AS fecha_final
                    FROM Tareas
                    LEFT JOIN Subtareas ON Tareas.id_tarea = Subtareas.fk_tareas AND Subtareas.ver = 1
                    WHERE Tareas.ver = 1
                    GROUP BY Tareas.id_tarea
                 ) tar
                RIGHT JOIN Ciclos ON tar.fk_ciclo = Ciclos.id_ciclo
                GROUP BY Ciclos.id_ciclo
                HAVING Ciclos.ver = 1;`
                ,{
                replacements: { fkArea: req.body.user.area },
                type: Sequelize.QueryTypes.SELECT
            });

            /*let ciclos = await dataBaseSQL.ciclos.findAll({
                where: {
                    fk_area :   req.body.user.area,
                    ver:        1
                },
            });*/

            res.json({error:0, ErrorDetalle:"", objeto:ciclos});

        }
        catch(error){
            console.log(error);
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message, errorExpand : error});   
            return 1;
        }
    },
    
    addCiclos: async (req,res) => {
        try{
            let ciclo = await dataBaseSQL.ciclos.create({
                fk_area         : req.body.user.area,
                nombre          : req.body.nombre,
                detalles        : req.body.detalles,
                fecha_inicio    : req.body.fechaInicio,     
                fecha_final     : req.body.fechaFinal,
                ver             : 1
            });
            res.json({error :0, errorDetalle: "", objeto:ciclo});
            return 0
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    modCiclos: async (req,res) => {
        try{
            let ciclo = await dataBaseSQL.ciclos.update({
                nombre    : req.body.nombre,
                detalles    : req.body.detalles,
                fecha_inicio    : req.body.fechaInicio,     
                fecha_final     : req.body.fechaFinal,
            },{
                where:{
                    id_ciclo: req.body.id_ciclo
                }
            });
            res.json({error :0, errorDetalle: "", objeto:ciclo});
            return 0;
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    deleteCiclos: async (req,res) => {
        try{
            let ciclo = await dataBaseSQL.ciclos.update({
                ver         : 0,
            },{
                where:{
                    id_ciclo: req.body.id_ciclo
                }
            });
            
            res.json({error :0, errorDetalle: "", objeto:ciclo});
            return 0;
        }
        catch(error){
            let ciclo = await dataBaseSQL.ciclos.update({
                ver:    0
            },{
                where:{
                    id_ciclo: req.body.id_ciclo
                }
            });
            res.json({error :0, errorDetalle: "", objeto:ciclo});
        }
    },

    /* CRUD De Proceos */
    viewProceso: async (req,res) => {
        try{
            let procesos = await dataBaseSQL.sequelize.query(
                "SELECT procesos.*, SUM(subtareas.horasAprox) as horas_proceso, AVG(subtareas.avance) as progreso_proceso FROM procesos LEFT JOIN tareas ON procesos.id_procesos = tareas.fk_procesos LEFT JOIN subtareas ON tareas.id_tarea = subtareas.fk_tareas WHERE procesos.fk_ciclo = :fkCiclo GROUP BY procesos.id_procesos;"
                ,{
                replacements: { fkCiclo: req.body.ciclo },
                type: Sequelize.QueryTypes.SELECT
            });
            
            /*let procesos = await dataBaseSQL.procesos.findAll({
                where: {
                    fk_area :   req.body.user.area,
                    fk_ciclo:   req.body.ciclo,
                    ver:        1
                },
            });*/
            res.json({error:0, ErrorDetalle:"", objeto:procesos});

        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    addProceso: async (req,res) => {
        try{
            if(req.body.nombre == "" || req.body.nombre == undefined){
                req.body.nombre = null;
            }
            if(req.body.detalles == "" || req.body.detalles == undefined) {
                req.body.detalles = null;
            }
            let procesos = await dataBaseSQL.procesos.create({
                fk_area :   req.body.user.area,
                nombre  :   req.body.nombre,
                detalles:   req.body.detalles,
                fk_ciclo:   req.body.ciclo,
                ver     :   1
            });
            res.json({error :0, errorDetalle: "", objeto:procesos});
            return 0;
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    modProceso: async (req,res) => {
        try{
            let procesos = await dataBaseSQL.procesos.update({
                nombre      : req.body.nombre,
                detalles    : req.body.detalles,
            },{
                where:{
                    id_procesos: req.body.idProceso
                }
            });
            res.json({error :0, errorDetalle: "", objeto:procesos});
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    deleteProceso: async (req,res) => {
        try{
            let procesos = await dataBaseSQL.procesos.update({
                ver:    0
            },{
                where:{
                    id_procesos: req.body.idProceso
                }
            });
            res.json({error :0, errorDetalle: "", objeto:procesos});
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
            /*SELECT tareas.*, SUM(subtareas.horasAprox) as horas_tarea, AVG(subtareas.avance) as progreso_tarea FROM tareas LEFT JOIN subtareas ON tareas.id_tarea = subtareas.fk_tareas WHERE tareas.ver = 1 and subtareas = 1 GROUP BY tareas.id_tarea;*/
            let tareas;
            tareas = await dataBaseSQL.sequelize.query(
            `
                SELECT  Tareas.*, 
                        Empleados.nombre AS nombreUser, 
                        Empleados.mail AS mailUser, 
                        COALESCE(SUM(Subtareas.horas_tarea), 0) AS horas_tarea, 
                        COALESCE(AVG(Subtareas.progreso_tarea), 0) AS progreso_tarea,
                        
                        CASE
                            WHEN COUNT(Subtareas.id_sub_tarea) = COUNT(CASE WHEN Subtareas.progreso_tarea = 100 THEN 1 END)
                            THEN MAX(Subtareas.fecha_final)
                            ELSE NULL
                        END AS fecha_final,

                        CASE
                            WHEN COUNT(Subtareas.id_sub_tarea) = 0 THEN 2
                            WHEN COUNT(Subtareas.id_sub_tarea) = COUNT(CASE WHEN Subtareas.progreso_tarea = 100 THEN 1 END)
                            THEN 3
                            ELSE 2
                        END AS estado
                FROM Tareas 
                LEFT JOIN (
                    SELECT  Subtareas.id_sub_tarea, Subtareas.fk_tareas ,Subtareas.titulo,
                            Subtareas.asignacion, Subtareas.estado, Subtareas.prioridad, 
                            Subtareas.notas, Subtareas.fecha_inicio, Subtareas.fecha_final, Subtareas.ver, 
                            COALESCE(SUM(Muestras.horasAprox), Subtareas.horasAprox) AS horas_tarea,
                            CASE WHEN COUNT(Muestras.id_muestra) > 0 AND Subtareas.avance != 100
                                THEN CASE
                                    WHEN AVG(Muestras.avance) = 100 THEN 99
                                    ELSE COALESCE(AVG(Muestras.avance), 0)
                                    END
                                ELSE Subtareas.avance
                            END AS progreso_tarea,
                            CASE
                                WHEN COUNT(Muestras.id_muestra) = 0 THEN Subtareas.estado
                                WHEN COUNT(Muestras.id_muestra) = COUNT(CASE WHEN Muestras.avance = 100 THEN 1 END)
                                THEN 3
                                ELSE 2
                            END AS estado_sub
                    FROM Subtareas 
                    LEFT JOIN Muestras ON Subtareas.id_sub_tarea = Muestras.fk_sub_tareas AND Muestras.ver = 1 
                    LEFT JOIN Empleados ON Subtareas.asignacion = Empleados.id_empleado
                    WHERE Subtareas.ver = 1
                    GROUP BY Subtareas.id_sub_tarea, Subtareas.horasAprox, Subtareas.avance, Subtareas.fecha_final, Subtareas.estado
                ) AS Subtareas ON Tareas.id_tarea = Subtareas.fk_tareas
                LEFT JOIN Empleados ON Tareas.fk_empleado_asignado = Empleados.id_empleado
                WHERE Tareas.ver = 1 AND Tareas.fk_ciclo = :idCiclo
                GROUP BY Tareas.id_tarea;
            `        
            ,{
                replacements: { idCiclo: req.body.idCiclo },
                type: Sequelize.QueryTypes.SELECT
            });                

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
    vieTareaPersonal:  async (req,res) => { 
        try {
            
        }
        catch(error){

        }
    },

    // Agregar tareas
    addTarea:  async (req,res) => { 
        try{
            let empleadoAsignado = await dataBaseSQL.empleados.findOne(
                {
                    where: {
                        mail : req.body.empleado_asignado
                    },
                }
            );            
            if(empleadoAsignado === null){
                res.json({error : 10, errorDetalle: "El correo del responsable no existe."});
                return 1;
            }else if(empleadoAsignado.fk_area != req.body.user.area){
                res.json({error : 99, errorDetalle: "Usuario indicado no perteneciente al area"});
                return 1;
            }else{
                let tarea = await dataBaseSQL.tareas.create({
                    fk_empleado_asignado    : empleadoAsignado.id_empleado,
                    fk_area                 : req.body.user.area,
                    fk_ciclo                : req.body.idCiclo,
                    nombre                  : req.body.nombre,
                    //estado                  : req.body.estado,
                    prioridad               : req.body.prioridad,
                    fecha_inicio            : req.body.fechaInicial,
                    //fecha_final             : null,
                    notas                   : req.body.notas,
                    //progreso                : req.body.progreso,
                    //horas_Necesarias        : 0,
                    mostrar                 : 1
                });
                res.json({error :0, errorDetalle: "", objeto:tarea});
                return 0;
            }
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({errorCompleto:error, error : codeError, errorDetalle: error.message});   
            return 1;
        }       
    },
    
    // Modificar tareas 
    modTarea: async (req,res) => { 
        try{
            let empleadoAsignado;
            if(req.body.empleado_asignado != req.body.tarea.mailUser){
                empleadoAsignado = await dataBaseSQL.empleados.findOne(
                    {
                        where: {
                            mail : req.body.empleado_asignado
                        },
                    }
                );
                if(empleadoAsignado === null){
                    res.json({error : 10, errorDetalle: "El correo del responsable no existe."});
                    return 1;
                }else{
                    empleadoAsignado = empleadoAsignado.id_empleado;
                }
            }else{
                empleadoAsignado =      req.body.tarea.fk_empleado_asignado;
            }

            let tareaModificada = await dataBaseSQL.tareas.update({
                fk_empleado_asignado    : empleadoAsignado,
                fk_area                 : req.body.user.area,
                nombre                  : req.body.nombre,
                //estado                  : req.body.estado,
                prioridad               : req.body.prioridad,
                fecha_inicio            : req.body.fechaInicio,
                //fecha_final             : req.body.fechaFinal,
                notas                   : req.body.notas, 
                // progreso                : req.body.progreso,
                //horas_Necesarias      : req.body.horas,
                fk_ciclo                : req.body.idCiclo
            },{
                where:{
                    id_tarea : req.body.tarea.id_tarea
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
                ver : 0,
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

    // CRUD de Sub tareas
    /**
     * 
     * @param {id_tareas, titulo, asignacion, horasAprox, avece, estado, prioridad, notas, user} req 
     * @param {*} res 
     */
    addSubTarea: async (req,res) => {
        try{
            //let fechaIngresadaFinal = new Date(req.body.fechaFinal); 
            let fehcaIngresadaInicial = new Date(req.body.fechaInicial);
            let titulo      = req.body.titulo || null;
            let horasAprox  = req.body.horasAprox || null;
            let avance      = req.body.avance 
            let estado      = req.body.estado;
            let prioridad   = req.body.prioridad;
            let notas       = req.body.notas || null;
            

            if(req.body.asignacion != undefined){
                let empleadoAsignado = await dataBaseSQL.empleados.findOne(
                    {
                        where: {
                            mail : req.body.asignacion
                        },
                    }
                );   
                if(empleadoAsignado === null){
                    res.json({error : 10, errorDetalle: "El correo del responsable no existe."});
                    return 1;
                }else if(empleadoAsignado.fk_area != req.body.user.area){
                    res.json({error : 99, errorDetalle: "Usuario indicado no perteneciente al area."});
                    return 1;
                }else if(req.body.id_tareas == undefined){
                    res.json({error : 99, errorDetalle: "No se selecciono una tarea."});
                    return 1;
                }else{
                    let subTarea = await dataBaseSQL.subtareas.create({
                        fk_tareas       : req.body.id_tareas,
                        titulo          : titulo,
                        asignacion      : empleadoAsignado.id_empleado,
                        horasAprox      : horasAprox,
                        avance          : avance,
                        estado          : estado,
                        prioridad       : prioridad,
                        notas           : notas,
                        fecha_inicio    : fehcaIngresadaInicial,
                        fecha_final     : null,
                        ver:        1
                    });

                    res.json({error :0, errorDetalle: "", objeto:subTarea});
                    return 0;

                }
            }else{
                res.json({error : 10, errorDetalle: "No se envio ningun empleado."});
                return 1;
            }
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({errorGeneral: error, error : codeError, errorDetalle: error.message });   
            return 1;
        }
    },

    modSubTarea: async (req,res) => {
        try{
            let empleadoAsignado;
            if(req.body.asignacion != req.body.subtarea.Empleados.mail){
                empleadoAsignado = await dataBaseSQL.empleados.findOne(
                    {
                        where: {
                            mail : req.body.empleado_asignado
                        },
                    }
                );
                if(empleadoAsignado === null){
                    res.json({error : 10, errorDetalle: "El correo del responsable no existe."});
                    return 1;
                }
            }else{
                empleadoAsignado =  req.body.subtarea.Empleados;
            }

            let fechaFinal;
            let estado = req.body.estado;
            if(req.body.avance == 100){
                let ahora = new Date();
                estado = 3
                fechaFinal = new Date(new Intl.DateTimeFormat('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit' }).format(ahora).replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
            }else{
                fechaFinal = null
            }

            let subtarea = await dataBaseSQL.subtareas.update({
                titulo          : req.body.titulo,    
                asignacion      : empleadoAsignado.id_empleado,        
                horasAprox      : req.body.horasAprox,        
                avance          : req.body.avance,    
                estado          : estado,    
                prioridad       : req.body.prioridad,        
                notas           : req.body.notas,
                fecha_inicio    : req.body.fechaInicio,
                fecha_final     : fechaFinal
            },{
                where:{
                    id_sub_tarea : req.body.subtarea.id_sub_tarea
                }
            });
            res.json({error: 0, errorDetalle:"",objeto:subtarea});
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    viewSubTarea: async (req,res) => {
        try{
            let subTareas = await dataBaseSQL.sequelize.query(
            `
                SELECT  Subtareas.titulo, Subtareas.asignacion, Subtareas.estado, 
                        Subtareas.prioridad, Subtareas.notas, Subtareas.fecha_inicio, 
                        Subtareas.fecha_final, Subtareas.ver, Empleados.nombre as nombreUser, 
                        Empleados.mail as mailUser,
                        
                        CASE
                            WHEN COUNT(Muestras.id_muestra) > 0
                            THEN COALESCE(SUM(Muestras.horasAprox),0)
                            ELSE Subtareas.horasAprox
                        END AS horas_tarea,

                        CASE WHEN COUNT(Muestras.id_muestra) > 0 AND Subtareas.avance != 100
                            THEN CASE
                                WHEN AVG(Muestras.avance) = 100 THEN 99
                                ELSE COALESCE(AVG(Muestras.avance), 0)
                            END
                            ELSE Subtareas.avance
                        END AS progreso_tarea,      

                        CASE
                            WHEN COUNT(Muestras.id_muestra) = 0 THEN Subtareas.estado
                            WHEN COUNT(Muestras.id_muestra) = COUNT(CASE WHEN Muestras.avance = 100 THEN 1 END)
                            THEN 3
                            ELSE 2
                        END AS estado

                FROM Subtareas 
                LEFT JOIN Muestras ON Subtareas.id_sub_tarea = Muestras.fk_sub_tareas and Muestras.ver = 1 
                LEFT JOIN Empleados ON Subtareas.asignacion = Empleados.id_empleado
                WHERE Subtareas.ver = 1 and Subtareas.fk_tareas = :idtarea
                GROUP BY Subtareas.id_sub_tarea;
            `,
            {
                replacements: { idtarea: req.body.idtarea },
                type: Sequelize.QueryTypes.SELECT
            });                

            res.json({error :0, errorDetalle: "", objeto:subTareas});            
            return 0;
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    deleteSubTarea: async (req,res) => {
        try{
            let subtarea = await dataBaseSQL.subtareas.update({
                ver : 0 
            },{
                where:{
                    id_sub_tarea : req.body.id_subtarea
                }
            });
            res.json({error: 0, errorDetalle:"",objeto:subtarea});
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    terminarSubTarea: async (req,res) => {
        try{
            let ahora = new Date();
            let fechaFinal = new Date(new Intl.DateTimeFormat('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit' }).format(ahora).replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
            let subtarea
            let cantidadDeMuestrass = await dataBaseSQL.sequelize.query(
                `
                    SELECT count(*) as total_Muestrass
                    FROM Subsubtareas
                    WHERE Subsubtareas.fk_sub_tareas = :idSubtarea;
                `        
                ,{
                    replacements: { idSubtarea: req.body.subtarea.id_sub_tarea },
                    type: Sequelize.QueryTypes.SELECT
                });  

                
            if (cantidadDeMuestrass[0].total_Muestrass > 0){
                subtarea = await dataBaseSQL.muestras.update({
                    estado: 3,
                    avance : 100,
                    fecha_final: fechaFinal  
                },{
                    where:{
                        fk_sub_tareas : req.body.subtarea.id_sub_tarea
                    }
                });
            }else{
                subtarea = await dataBaseSQL.subtareas.update({
                    estado: 3,
                    avance : 100,
                    fecha_final: fechaFinal  
                },{
                    where:{
                        id_sub_tarea : req.body.subtarea.id_sub_tarea
                    }
                });
            }
            
            res.json({error: 0, errorDetalle:"",objeto:subtarea});
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    // CRUD de Sub Sub tareas
    addMuestras: async (req,res) => {
        try{
            let numero_de_orden = req.body.numero_de_orden || null;                 
            let titulo          = req.body.titulo          || null;     
            let responsable     = req.body.responsable     || null;             
            let horasAprox      = req.body.horasAprox      || null;         
            let avance          = req.body.avance          || null;     
            let notas           = req.body.notas           || null;
            

            if(req.body.asignacion != undefined){
                responsable = await dataBaseSQL.empleados.findOne(
                    {
                        where: {
                            mail : req.body.responsable
                        },
                    }
                );   
                if(responsable === null){
                    res.json({error : 10, errorDetalle: "El correo del responsable no existe."});
                    return 1;
                }else if(req.body.id_Subtareas == undefined){
                    res.json({error : 99, errorDetalle: "No se selecciono una sub tarea."});
                    return 1;
                }else{
                    let muestras = await dataBaseSQL.muestras.create({
                        fk_sub_tareas   : req.body.id_Subtareas,
                        titulo          : titulo,
                        numero_de_orden : numero_de_orden,
                        responsable     : responsable,
                        horasAprox      : horasAprox,
                        avance          : avance,
                        notas           : notas,
                        ver             : 1
                    });

                    res.json({error :0, errorDetalle: "", objeto:muestras});
                    return 0;

                }
            }else{
                res.json({error : 10, errorDetalle: "No se envio ningun empleado."});
                return 1;
            }
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({errorGeneral: error, error : codeError, errorDetalle: error.message });   
            return 1;
        }
    },

    modMuestras: async (req,res) => {
        try{
            let empleadoAsignado;
            if(req.body.asignacion != req.body.subtarea.Empleados.mail){
                empleadoAsignado = await dataBaseSQL.empleados.findOne(
                    {
                        where: {
                            mail : req.body.empleado_asignado
                        },
                    }
                );
                if(empleadoAsignado === null){
                    res.json({error : 10, errorDetalle: "El correo del responsable no existe."});
                    return 1;
                }
            }else{
                empleadoAsignado =  req.body.subtarea.Empleados;
            };
            let muestras = await dataBaseSQL.muestras.update({
                fk_sub_tareas   : req.body.id_Subtareas,
                titulo          : req.body.titulo,
                numero_de_orden : req.body.numero_de_orden,
                responsable     : empleadoAsignado.id_empleado,
                horasAprox      : req.body.horasAprox,
                avance          : req.body.avance,
                notas           : req.body.notas,
            },{
                where:{
                    id_muestras : req.body.subtarea.id_muestras
                }
            });
            res.json({error: 0, errorDetalle:"",objeto:muestras});
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    viewMuestras: async (req,res) => {
        try{
            let subSubTarea = await dataBaseSQL.muestras.findAll({
                where: {
                    ver : 1,
                    fk_sub_tareas : req.body.subTarea
                },
                attributes: ["id_muestras","fk_sub_tareas","numero_de_orden","titulo","responsable","horasAprox","avance","notas"],
                include: [
                    {association : "Empleados",attributes: ['nombre','mail']},
                ]
            });

            res.json({error: 0, errorDetalle:"",objeto:subSubTarea});
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },
    
    deleteMuestras: async (req,res) => {
        try{
            let muestra = await dataBaseSQL.muestras.update({
                ver : 0 
            },{
                where:{
                    id_muestra : req.body.id_muestra
                }
            });
            res.json({error: 0, errorDetalle:"",objeto:muestra});
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    terminarMuestras: async (req,res) => {
        try{
            let ahora = new Date();
            let fechaFinal = new Date(new Intl.DateTimeFormat('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit' }).format(ahora).replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));


            let subsubtarea = await dataBaseSQL.subsubtarea.update({
                avance : 100,
            },{
                where:{
                    id_sub_sub_tarea : req.body.id_subsubtarea
                }
            });
            res.json({error: 0, errorDetalle:"",objeto:subsubtarea});
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    // Metricas
    metricas: async (req,res) => {
        try{
            let ciclos = await dataBaseSQL.sequelize.query(
                `
                SELECT 
                    Ciclos.*,
                    COUNT(CASE WHEN tar.fecha_final IS NOT NULL THEN 1 END) AS tareas_realizadas,
                    COUNT(tar.id_tarea) AS tareas_totales
                FROM (
                    SELECT Tareas.*,
                        CASE
                            WHEN COUNT(Subtareas.id_sub_tarea) = COUNT(CASE WHEN Subtareas.avance = 100 THEN 1 END)
                            THEN MAX(Subtareas.fecha_final)
                            ELSE NULL
                        END AS fecha_final
                    FROM Tareas
                    LEFT JOIN Subtareas ON Tareas.id_tarea = Subtareas.fk_tareas AND Subtareas.ver = 1
                    WHERE Tareas.ver = 1
                    GROUP BY Tareas.id_tarea
                ) tar
                LEFT JOIN Ciclos ON tar.fk_ciclo = Ciclos.id_ciclo
                GROUP BY Ciclos.id_ciclo;
                `        
                ,{
                    type: Sequelize.QueryTypes.SELECT
                });
            res.json({error: 0, errorDetalle:"",objeto:ciclos});
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

}

module.exports = controlador;

