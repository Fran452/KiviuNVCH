const dataBase          = require("../database/models");
const {Sequelize, DATE, Op} = require('sequelize');
const xlsx              = require('xlsx-populate');
const path              = require("path");


var apirest = {
    status: 0,
    codeError : "",
    objeto: {}
}



const funcionesGenericas = require("../funcionesGenerales");

const controlador = {

    /* CRUD De Ciclos */
    viewCiclos: async (req,res) => {
        try{
            let ciclos = await dataBase.sequelize.query(
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

            /*let ciclos = await dataBase.ciclos.findAll({
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
            let ciclo = await dataBase.ciclos.create({
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
            let ciclo = await dataBase.ciclos.update({
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
            let ciclo = await dataBase.ciclos.update({
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
            let ciclo = await dataBase.ciclos.update({
                ver:    0
            },{
                where:{
                    id_ciclo: req.body.id_ciclo
                }
            });
            res.json({error :0, errorDetalle: "", objeto:ciclo});
        }
    },


    /* CRUD De Tareas */
    // Ver tareas
    viewTareas: async (req,res) => {
        try{
            /*SELECT tareas.*, SUM(subtareas.horasAprox) as horas_tarea, AVG(subtareas.avance) as progreso_tarea FROM tareas LEFT JOIN subtareas ON tareas.id_tarea = subtareas.fk_tareas WHERE tareas.ver = 1 and subtareas = 1 GROUP BY tareas.id_tarea;*/
            let tareas;
            tareas = await dataBase.sequelize.query(
            `
                SELECT  Tareas.id_tarea,
                        Tareas.fk_empleado_asignado,
                        Tareas.fk_ciclo,
                        Tareas.nombre,
                        Tareas.prioridad,
                        Tareas.fecha_inicio,
                        Tareas.notas,
                        Tareas.numero_de_orden, 
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
                    SELECT  Subtareas.id_sub_tarea, 
                            Subtareas.fk_tareas,
                            Subtareas.titulo,
                            Subtareas.asignacion, 
                            Subtareas.estado, 
                            Subtareas.prioridad, 
                            Subtareas.notas, 
                            Subtareas.fecha_inicio, 
                            Subtareas.fecha_final, 
                            Subtareas.ver, 
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
                GROUP BY Tareas.id_tarea, 
                        Tareas.fk_empleado_asignado, 
                        Tareas.fk_ciclo,
                        Tareas.nombre, 
                        Tareas.prioridad, 
                        Tareas.fecha_inicio,
                        Tareas.notas, 
                        Tareas.numero_de_orden,
                        Empleados.nombre, 
                        Empleados.mail
                ORDER BY Tareas.numero_de_orden;

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
            let empleadoAsignado = await dataBase.empleados.findOne(
                {
                    where: {
                        mail : req.body.empleado_asignado
                    },
                }
            );    
            let ordenDeLaTarea = await dataBase.sequelize.query(
                `
                    SELECT  COUNT(*) as cantidadDeTareas
                    FROM Tareas
                    WHERE fk_ciclo = :idCiclo
                `,
                {
                    replacements: { idCiclo: req.body.idCiclo},
                    type: Sequelize.QueryTypes.SELECT
                });
                    
            if(empleadoAsignado === null){
                res.json({error : 10, errorDetalle: "El correo del responsable no existe."});
                return 1;
            }else if(empleadoAsignado.fk_area != req.body.user.area){
                res.json({error : 99, errorDetalle: "Usuario indicado no perteneciente al area"});
                return 1;
            }else{
                ordenDeLaTarea = ordenDeLaTarea[0].cantidadDeTareas + 1;

                let tarea = await dataBase.tareas.create({
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
                    mostrar                 : 1,
                    numero_de_orden         : ordenDeLaTarea 
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
                empleadoAsignado = await dataBase.empleados.findOne(
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

            let tareaModificada = await dataBase.tareas.update({
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
            let tareaModificada = await dataBase.tareas.update({
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

    // Mover tarea
    moveTarea: async (req,res) => {
        try{

            let tareaModificada
            let contador = 0

            tareaModificada = await dataBase.tareas.update({
                    numero_de_orden: req.body.final
            },{
                where:{
                    id_tarea : req.body.idTarea
                }
            });
            contador += tareaModificada[0];
            if(req.body.inicial < req.body.final){
                tareaModificada = await dataBase.tareas.update({
                    numero_de_orden: Sequelize.literal('numero_de_orden - 1')
                },{
                    where:{
                        fk_ciclo : req.body.idCiclo,
                        id_tarea : {
                            [Op.ne]: req.body.idTarea
                        },
                        numero_de_orden: {
                            [Op.lte]: req.body.final 
                        }
                    }
                });
                contador += tareaModificada[0];
            }else{
                tareaModificada = await dataBase.tareas.update({
                    numero_de_orden: Sequelize.literal('numero_de_orden + 1')
                },{
                    where:{
                        fk_ciclo : req.body.idCiclo,
                        id_tarea : {
                            [Op.ne]: req.body.idTarea
                        },
                        numero_de_orden: {
                            [Op.lte]: req.body.inicial,
                            [Op.gte]: req.body.final 
                        }
                    }
                });
                contador += tareaModificada[0];
            }

            res.json({error : 0 , errorDetalle: '',objeto:contador});  
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
                let empleadoAsignado = await dataBase.empleados.findOne(
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
                    let subTarea = await dataBase.subtareas.create({
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
            // Correccion if(req.body.asignacion != req.body.subtarea.Empleados.mail)
            if(req.body.empleado_asignado != req.body.subtarea.mailUser){
                empleadoAsignado = await dataBase.empleados.findOne(
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
                empleadoAsignado =  req.body.subtarea.asignacion;
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

            let subtarea = await dataBase.subtareas.update({
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
            let subTareas = await dataBase.sequelize.query(
            `
                SELECT  Subtareas.titulo, Subtareas.asignacion, Subtareas.estado, 
                        Subtareas.prioridad, Subtareas.notas, Subtareas.fecha_inicio, 
                        Subtareas.fecha_final, Subtareas.ver, Empleados.nombre as nombreUser, 
                        Empleados.mail as mailUser, Subtareas.id_sub_tarea,
                        
                        CASE
                            WHEN COUNT(Muestras.id_muestra) > 0
                            THEN COALESCE(SUM(Muestras.horasAprox),0)
                            ELSE Subtareas.horasAprox
                        END AS horas_tarea,

                        CASE 
                            WHEN COUNT(Muestras.id_muestra) > 0 AND Subtareas.avance != 100
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
            let subtarea = await dataBase.subtareas.update({
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
            let muestra;
            let fechaFinal = new Date(new Intl.DateTimeFormat('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit' }).format(ahora).replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
            let subtarea;
            let cantidadDeMuestrass = await dataBase.sequelize.query(
                `
                    SELECT count(*) as total_Muestrass
                    FROM muestras
                    WHERE muestras.fk_sub_tareas = :idSubtarea;
                `        
                ,{
                    replacements: { idSubtarea: req.body.subtarea.id_sub_tarea },
                    type: Sequelize.QueryTypes.SELECT
                });  

                
            if (cantidadDeMuestrass[0].total_Muestrass > 0){
                muestra = await dataBase.muestras.update({
                    estado: 3,
                    avance : 100,
                    fecha_final: fechaFinal  
                },{
                    where:{
                        fk_sub_tareas : req.body.subtarea.id_sub_tarea
                    }
                });
                
                subtarea = await dataBase.subtareas.update({
                    estado: 3,
                    avance : 100,
                    fecha_final: fechaFinal  
                },{
                    where:{
                        id_sub_tarea : req.body.subtarea.id_sub_tarea
                    }
                });
            }else{
                subtarea = await dataBase.subtareas.update({
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

    // CRUD de Muestras
    addMuestras: async (req,res) => {
        try{
            let numero_de_orden = req.body.numero_de_orden || null;                 
            let titulo          = req.body.titulo          || null;     
            let responsable     = req.body.responsable     || null;             
            let horasAprox      = req.body.horasAprox      || null;         
            let avance          = req.body.avance;     
            let notas           = req.body.notas           || null;
            
            // Corrección if(req.body.asignacion != undefined)
            if(req.body.responsable != undefined){
                responsable = await dataBase.empleados.findOne(
                    {
                        where: {
                            mail : req.body.responsable
                        },
                    }
                );   
                console.log(responsable);
                if(responsable === null){
                    res.json({error : 10, errorDetalle: "El correo del responsable no existe."});
                    return 1;
                }else if(req.body.id_Subtareas == undefined){
                    res.json({error : 99, errorDetalle: "No se selecciono una sub tarea."});
                    return 1;
                }else{
                    let muestras = await dataBase.muestras.create({
                        fk_sub_tareas   : req.body.id_Subtareas,
                        titulo          : titulo,
                        numero_de_orden : numero_de_orden,
                        responsable     : responsable.id_empleado,
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
            //Correcciones if(req.body.asignacion != req.body.subtarea.Empleados.mail)
            if(req.body.empleado_asignado != req.body.muestra.Empleados.mail){
                empleadoAsignado = await dataBase.empleados.findOne(
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
                // Correcciones empleadoAsignado =  req.body.subtarea.Empleados;
                empleadoAsignado =  req.body.muestra.Empleados;
            };
            let muestras = await dataBase.muestras.update({
                fk_sub_tareas   : req.body.id_Subtareas,
                titulo          : req.body.titulo,
                numero_de_orden : req.body.numero_de_orden,
                responsable     : empleadoAsignado.id_empleado,
                horasAprox      : req.body.horasAprox,
                avance          : req.body.avance,
                notas           : req.body.notas,
            },{
                where:{
                    // Correcciones id_muestras : req.body.subtarea.id_muestras
                    id_muestra : req.body.muestra.id_muestra
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
            let subSubTarea = await dataBase.muestras.findAll({
                where: {
                    ver : 1,
                    fk_sub_tareas : req.body.idSubTarea
                },
                attributes: ["id_muestra","fk_sub_tareas","numero_de_orden","titulo","responsable","horasAprox","avance","notas"],
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
            let muestra = await dataBase.muestras.update({
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


            let muestra = await dataBase.muestras.update({
                avance : 100,
            },{
                where:{
                    id_muestra : req.body.muestra.id_muestra
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

    // Metricas
    metricas: async (req,res) => {
        try{
            let ciclos = await dataBase.sequelize.query(
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

    // Excel
    // Subir excel
    subirExcel: async (req,res) => {
        try{
            console.log("subi el excel");
            if(req.file){
                let excel = path.join(__dirname,"../excel/muestras.xlsx");
                let estructuraExcel = await xlsx.fromFileAsync(excel);
                let estructuraTitutlo       = estructuraExcel.sheet('Hoja1').cell(`A1`).value();
                let estructuraNumOrde       = estructuraExcel.sheet('Hoja1').cell(`A2`).value();
                let estructuraTitulo        = estructuraExcel.sheet('Hoja1').cell(`B2`).value();
                let estructuraResponsable   = estructuraExcel.sheet('Hoja1').cell(`C2`).value();
                let estructuraHoras         = estructuraExcel.sheet('Hoja1').cell(`D2`).value();
                let estructuraNotas         = estructuraExcel.sheet('Hoja1').cell(`E2`).value();

                if( estructuraTitutlo       == 'Carga de Muestras'      && 
                    estructuraNumOrde       == 'Numero de orden'        &&
                    estructuraTitulo        == 'Titulo'                 &&
                    estructuraResponsable   == 'responsable (via mail)' &&
                    estructuraHoras         == 'Horas aprox'            &&
                    estructuraNotas         == 'Notas')
                {
                    res.json({error: 0, errorDetalle:'',objeto:'excel subido'});
                    return 0;
                }else{
                    res.json({error: 0, errorDetalle:'La extructura no fue subida correctaente',});
                    return 1;
                }
            }else{
                res.json({error: 99, errorDetalle:'El excel no fue subido correctamente',});
                return 1;
            }
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    // Cargar excel
    cargaDeExcel: async (req,res) => {
        try{
            
            let excel = path.join(__dirname,"../excel/muestras.xlsx");
            let estructuraExcel = await xlsx.fromFileAsync(excel);
            let acc = 0, i = 3;
            let numero_de_orden,titulo,responsableExcel,responsable,horasAprox,notas
            let muestrasSubidas = [];
            do{
                numero_de_orden     = estructuraExcel.sheet('Hoja1').cell(`A${i}`).value();
                if(numero_de_orden == undefined && acc > 0){
                    continue;
                }else{   
                    titulo              = estructuraExcel.sheet('Hoja1').cell(`B${i}`).value();
                    responsableExcel    = estructuraExcel.sheet('Hoja1').cell(`C${i}`).value();
                    if(responsableExcel != undefined){
                        responsable = await dataBase.empleados.findOne(
                            {
                                where: {
                                    mail : responsableExcel
                                },
                                attributes:['id_empleado']
                            }
                        );  
                        console.log(responsable);
                        if(responsable === null){
                            responsable = undefined;
                        }else{
                            responsable = responsable.dataValues.id_empleado;
                        }
                    }else{
                        responsable = undefined;
                    }
                    horasAprox          = estructuraExcel.sheet('Hoja1').cell(`D${i}`).value();   
                    if(horasAprox == undefined){
                        horasAprox = 4;
                    } 
                    notas               = estructuraExcel.sheet('Hoja1').cell(`E${i}`).value();    
                    let muestras = await dataBase.muestras.create({
                        fk_sub_tareas   : req.body.id_subtarea,
                        titulo          : titulo,
                        numero_de_orden : numero_de_orden,
                        responsable     : responsable,
                        horasAprox      : horasAprox,
                        avance          : 0,
                        notas           : notas,
                        ver             : 1
                    }); 
                    muestrasSubidas.push(muestras)
                    acc++;
                    i++;
                }
                
            }while(numero_de_orden != undefined);

            res.json({error: 0, errorDetalle:'',objeto:{objetos_subidos: acc, muestras_subidas:muestrasSubidas}});
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

