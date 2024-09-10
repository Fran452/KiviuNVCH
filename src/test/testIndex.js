require('dotenv').config();
const dataBaseSQL = require("../databaseSQL/models");
const funcionesDeTest = require('./funcionesTestGenericas')
const funcionesGenericas = require("../funcionesGenerales");


const controlador = {
    
    testGenerico: async (req,res) => {
        let links = {
            ArmarBaseDeDatos:   `${process.env.WEB}/test/armado-SQL`,
            ArmarBaseDeDatosNew:`${process.env.WEB}/test/armado-SQL-NEW`,
            planesAcción:{
                testGenericos:  `${process.env.WEB}/test/plan-accion`,
                ciclos:{
                    add:    `${process.env.WEB}/test/plan-accion/addCiclos`,
                    view:   `${process.env.WEB}/test/plan-accion/viewCiclos`,
                    mod:    `${process.env.WEB}/test/plan-accion/modCiclos`,
                    delete: `${process.env.WEB}/test/plan-accion/deleteCiclos`
                },
                tareas:{
                    add:    `${process.env.WEB}/test/plan-accion/addTask`,
                    view:   `${process.env.WEB}/test/plan-accion/viewTareas`,
                    mod:    `${process.env.WEB}/test/plan-accion/modTask`,
                    delete: `${process.env.WEB}/test/plan-accion/deleteTask`
                },
                subTarea:{
                    add:    `${process.env.WEB}/test/plan-accion/addSubTask`,    
                    view:   `${process.env.WEB}/test/plan-accion/viewSubTask`,
                    mod:    `${process.env.WEB}/test/plan-accion/modSubTask`,
                    delete: `${process.env.WEB}/test/plan-accion/deleteSubTask`
                },
            },
        }

        res.json(links);
    },

    crearBaseDeDatos: async (req,res) => {
        try{
            objeto = {}
            let ahora = new Date()

            let fechaInicial = ahora.toISOString().split('T')[0];
            ahora.setDate(ahora.getDate() + 7);
            let fechaFin = ahora.toISOString().split('T')[0];

            let empleadoYaSubido = await funcionesDeTest.buscarUsuarioPorMail('franciscolemacr@gmail.com');
            if(empleadoYaSubido != undefined){
                res.json("base de datos ya subida anteriormente");
                return 0;
            }
            //let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();
            
            let area1 =  await funcionesDeTest.crearArea('Prestamos','sin powe By');
            
            let usuarioCreado = await funcionesDeTest.crearUsuario(area1.id_area,1,"francisco Lema",'$2b$16$3LvhCzCPQm.eenIQkZGk/uT8fwtDE4QPsg1RzLhrKzM9HTrGhlpTq','FRAN','franciscolemacr@gmail.com');
            
            let usuario = {
                id: usuarioCreado.id_empleado,
                nombre:usuarioCreado.nombre,
                area1:usuarioCreado.fk_area,
                puesto:usuarioCreado.fk_puesto,
                mail:usuarioCreado.mail  
            };

            let ciclo
            let tarea
            let subtarea

            let ciclos = [];

            ciclo     = await funcionesDeTest.crearCiclo(usuario.area1,"Ciclo Préstamos","Ciclo de prestamos primera revicion",fechaInicial,fechaFin,1);
            ciclo.tareas = [];

                tarea     = await funcionesDeTest.crearTarea(usuario.id,usuario.area1,ciclo.id_ciclo,"Préstamos Consumo y Comercial 1° revisión",1,1,fechaInicial,"notas");
                tarea.subTarea = [];
                
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Relevamiento",usuario.id,20,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Matriz de Riesgos y Controles",usuario.id,2,0,1,1,fechaInicial,fechaFin,"esto son notas",1);



                tarea     = await funcionesDeTest.crearTarea(usuario.id,usuario.area1,ciclo.id_ciclo,"Normativa",1,1,fechaInicial,"notas");
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Normativa Consumo ",usuario.id,2,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Normativa Comercial",usuario.id,2,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Organigrama",usuario.id,2,0,1,1,fechaInicial,fechaFin,"esto son notas",1);


                tarea     = await funcionesDeTest.crearTarea(usuario.id,usuario.area1,ciclo.id_ciclo,"Cruces Contables con RI e Inventario",1,1,fechaInicial,"notas");
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Tarea realizada - Cruces RI, Invetarios y Contabilidad",usuario.id,1,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Cruce RI con Saldos Contables",usuario.id,2,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Cruce RI con Inventarios",usuario.id,6,0,1,1,fechaInicial,fechaFin,"esto son notas",1);


                tarea     = await funcionesDeTest.crearTarea(usuario.id,usuario.area1,ciclo.id_ciclo,"Procedimientos Cartera Consumo",1,1,fechaInicial,"notas");
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"TR Consumo",usuario.id,1,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Muestra Consumo",usuario.id,3,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Análisis Consumo",usuario.id,160,0,1,1,fechaInicial,fechaFin,"esto son notas",1);


            ciclo   =   await funcionesDeTest.crearCiclo(usuario.area1,"Procedimientos Cartera Comercial","Procedimientos Cartera Comercial",fechaInicial,fechaFin,1);
            
                tarea     = await funcionesDeTest.crearTarea(usuario.id,usuario.area1,ciclo.id_ciclo,"Cartera Comercial Clasificación y Previsionamiento",1,1,fechaInicial,"notas");
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"TR Consumo",usuario.id,1,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Muestra Consumo",usuario.id,4,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Análisis Consumo",usuario.id,248,0,1,1,fechaInicial,fechaFin,"esto son notas",1);

                tarea     = await funcionesDeTest.crearTarea(usuario.id,usuario.area1,ciclo.id_ciclo,"Cartera Comercial y Asimilable",1,1,fechaInicial,"notas");
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"TR Cartera Comercial y Asimilable",usuario.id,1,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Muestra Altas Líneas Comerciales",usuario.id,4,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Alta de Líneas Nuevas",usuario.id,2,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Análisis Altas Líneas Comerciales",usuario.id,164,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
                    
                tarea     = await funcionesDeTest.crearTarea(usuario.id,usuario.area1,ciclo.id_ciclo,"Comité de Crédito",1,1,fechaInicial,"notas");
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"TR Comité de Crédito",usuario.id,2,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Análisis Comité de Crédito",usuario.id,2,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Resumen Comité de Crédito",usuario.id,6,0,1,1,fechaInicial,fechaFin,"esto son notas",1);


                tarea     = await funcionesDeTest.crearTarea(usuario.id,usuario.area1,ciclo.id_ciclo,"Regimen Informativo",1,1,fechaInicial,"notas");
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"TR Verificación de Régimen Informativo",usuario.id,1,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Validaciones RI Deudores por NOP y BCRA",usuario.id,2,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Controles Entidad sobre RI Deudores",usuario.id,2,0,1,1,fechaInicial,fechaFin,"esto son notas",1);

                tarea     = await funcionesDeTest.crearTarea(usuario.id,usuario.area1,ciclo.id_ciclo,"Evidencia de Monitoreo",1,1,fechaInicial,"notas");
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"TR Monitoreo",usuario.id,1,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Monitoreo por Planeamiento",usuario.id,2,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Monitoreo por Gestión de Riesgos",usuario.id,2,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Seguimiento",usuario.id,3,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Informe Carga en Mawida",usuario.id,3,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
                
            ciclo     = await funcionesDeTest.buscarCiclo(ciclo.id_ciclo);  
            tarea     = await funcionesDeTest.buscarTarea(tarea.id_tarea);
            subtarea  = await funcionesDeTest.buscarSubTarea(subtarea.id_sub_tarea);


            res.json("subido todo");
        }
        catch(error){
            console.log(error);
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({errorDetalleCompleto : error, error : codeError, errorDetalle: error.message});   
            return 1;
            
        }
    },

    crearBaseDeDatosNew: async (req,res) => {
        try{
            console.log("entrando a la generacion de base de datos");


            let empleadoYaSubido = await funcionesDeTest.buscarUsuarioPorMail('francisco.lema@nbch.com.ar');

            if(empleadoYaSubido != undefined){
                res.json("base de datos ya subida anteriormente");
                return 0;
            };

            let ahora = new Date();

            let fechaInicial = ahora;
            ahora.setDate(ahora.getDate() + 7);
            let fechaFin = ahora;

            console.log(fechaInicial);
            console.log(fechaFin);

            let area1 = await funcionesDeTest.crearArea("Operaciones de Caja","https://powerbi.nbch.com.ar/reports/browse/Auditoria%20Interna");
            let area2 = await funcionesDeTest.crearArea("Alerta UIF","https://powerbi.nbch.com.ar/reports/browse/Auditoria%20Interna");
            let area3 = await funcionesDeTest.crearArea("Seguimiento de Observaciones","https://powerbi.nbch.com.ar/reports/browse/Auditoria%20Interna");
            let area4 = await funcionesDeTest.crearArea("Matriz del Cliente","https://powerbi.nbch.com.ar/reports/browse/Auditoria%20Interna");
            let areas = [area1,area2,area3,area4];
            
            let usuarios = []
            let usuario  = await funcionesDeTest.crearUsuario(area1.id_area,1,'Alejandro Camnasio','$2b$16$3LvhCzCPQm.eenIQkZGk/uT8fwtDE4QPsg1RzLhrKzM9HTrGhlpTq','AC','alejandro.camnasio@nbch.com.ar');
            usuarios.push(usuario);
            usuario  = await funcionesDeTest.crearUsuario(area1.id_area,1,'Favio Benzaquen','$2b$16$3LvhCzCPQm.eenIQkZGk/uT8fwtDE4QPsg1RzLhrKzM9HTrGhlpTq','FB','favio.benzaquen@nbch.com.ar');
            usuarios.push(usuario);
            usuario  = await funcionesDeTest.crearUsuario(area1.id_area,1,'Gustavo Rodriguez','$2b$16$3LvhCzCPQm.eenIQkZGk/uT8fwtDE4QPsg1RzLhrKzM9HTrGhlpTq','GR','gustavo.rodriguez@nbch.com.ar');
            usuarios.push(usuario);
            usuario  = await funcionesDeTest.crearUsuario(area1.id_area,1,'Yanina Monoff','$2b$16$3LvhCzCPQm.eenIQkZGk/uT8fwtDE4QPsg1RzLhrKzM9HTrGhlpTq','YM','yanina.monoff@nbch.com.ar');
            usuarios.push(usuario);
            usuario  = await funcionesDeTest.crearUsuario(area1.id_area,1,'Gustavo Rodas','$2b$16$3LvhCzCPQm.eenIQkZGk/uT8fwtDE4QPsg1RzLhrKzM9HTrGhlpTq','GR','gustavo.rodas@nbch.com.ar');
            usuarios.push(usuario);
            usuario  = await funcionesDeTest.crearUsuario(area1.id_area,1,'Francisco Lema','$2b$16$3LvhCzCPQm.eenIQkZGk/uT8fwtDE4QPsg1RzLhrKzM9HTrGhlpTq','FR','francisco.lema@nbch.com.ar');
            usuarios.push(usuario);
            usuario  = await funcionesDeTest.crearUsuario(area1.id_area,1,'Hernan Martel','$2b$16$3LvhCzCPQm.eenIQkZGk/uT8fwtDE4QPsg1RzLhrKzM9HTrGhlpTq','HM','hernandariomartel@gmail.com');
            usuarios.push(usuario);
            usuario  = await funcionesDeTest.crearUsuario(area1.id_area,1,'Alice Ramírez','$2b$16$3LvhCzCPQm.eenIQkZGk/uT8fwtDE4QPsg1RzLhrKzM9HTrGhlpTq','AR','alicemarcelaramirez@gmail.com');
            usuarios.push(usuario);
            let TD = await funcionesDeTest.crearUsuario(area1.id_area,1,"Maria Teresa Dorrego","1234","TD","maria.dorrego@nbch.com.ar");
            usuarios.push(TD);
            let DM = await funcionesDeTest.crearUsuario(area1.id_area,1,"Daniela Silvana	Molina","1234","DM","daniela.molina@nbch.com.ar");
            usuarios.push(DM);
            let SV = await funcionesDeTest.crearUsuario(area1.id_area,1,"Silvana	Vecchi","1234","SV","silvana.vecchi@nbch.com.ar");
            usuarios.push(SV);


            let baseDeDatos = {
                areas:areas,
                usuario : usuarios,
            }

            let ciclo;
            let tarea;
            let subtarea;

            let ciclos = [];

            fechaInicial = new Date('2024-08-01');
            fechaFin = new Date('2024-09-31');
            ciclo     = await funcionesDeTest.crearCiclo(area1.id_area,"TARJETA DE CREDITO","TARJETA DE CREDITO",fechaInicial,fechaFin,1);
            ciclo.tareas = [];


                tarea     = await funcionesDeTest.crearTarea(TD.id_empleado,area1.id_area,ciclo.id_ciclo,"TARJETA DE CREDITO",1,0,fechaInicial,"notas");
                tarea.subTarea = [];
                
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Relevamiento",TD.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Normativa",TD.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);

                ciclo.tareas.push(tarea);

                tarea     = await funcionesDeTest.crearTarea(TD.id_empleado,area1.id_area,ciclo.id_ciclo,"Analisis usuarios Tarjetas",1,1,fechaInicial,"notas");
                tarea.subTarea = [];    

                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Analisis usuarios Tarjetas",TD.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                
                ciclo.tareas.push(tarea);

                tarea     = await funcionesDeTest.crearTarea(TD.id_empleado,area1.id_area,ciclo.id_ciclo,"Analisis Alta de Usuarios",1,1,fechaInicial,"notas");
                tarea.subTarea = [];

                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Muestra altas de usuarios ",TD.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Analisis Alta de Usuarios",TD.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);

                ciclo.tareas.push(tarea);


                tarea     = await funcionesDeTest.crearTarea(TD.id_empleado,area1.id_area,ciclo.id_ciclo,"Analisis Baja de Usuarios",1,1,fechaInicial,"notas");
                tarea.subTarea = [];

                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Análisis Bajas de usuarios",TD.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Muestra Baja de usuarios",TD.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                
                ciclo.tareas.push(tarea);

                tarea     = await funcionesDeTest.crearTarea(TD.id_empleado,area1.id_area,ciclo.id_ciclo,"Revisión Interés TC",1,1,fechaInicial,"notas");
                tarea.subTarea = [];

                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Revisión Interés TC",TD.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);

                ciclo.tareas.push(tarea);

                tarea     = await funcionesDeTest.crearTarea(TD.id_empleado,area1.id_area,ciclo.id_ciclo,"Analisis Comercios adheridos",1,1,fechaInicial,"notas");
                tarea.subTarea = [];

                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Analisis alta Comercios Adheridos",TD.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Análisis Bajas de Comercios",TD.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Liquidaciones a comercios adheridos",TD.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Promociones ",TD.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);

                ciclo.tareas.push(tarea);
                
                tarea     = await funcionesDeTest.crearTarea(TD.id_empleado,area1.id_area,ciclo.id_ciclo,"Control Saldos Contables",1,1,fechaInicial,"notas");
                tarea.subTarea = [];

                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Control Saldos Contables",TD.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);

                ciclo.tareas.push(tarea);

                tarea     = await funcionesDeTest.crearTarea(TD.id_empleado,area1.id_area,ciclo.id_ciclo,"Análisis Administración de Plásticos",1,1,fechaInicial,"notas");
                tarea.subTarea = [];
                
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Análisis Administración de Plásticos",TD.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);

                ciclo.tareas.push(tarea);

                tarea     = await funcionesDeTest.crearTarea(TD.id_empleado,area1.id_area,ciclo.id_ciclo,"Análisis Tarjetas Recargables",1,1,fechaInicial,"notas");
                tarea.subTarea = [];

                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Análisis Tarjetas Recargables",TD.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);

                ciclo.tareas.push(tarea);

                tarea     = await funcionesDeTest.crearTarea(TD.id_empleado,area1.id_area,ciclo.id_ciclo,"Generción de Régimen Informativo",1,1,fechaInicial,"notas");
                tarea.subTarea = [];

                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Generción de Régimen Informativo",TD.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);

                ciclo.tareas.push(tarea);

                tarea     = await funcionesDeTest.crearTarea(TD.id_empleado,area1.id_area,ciclo.id_ciclo,"Control de Monitoreo",1,1,fechaInicial,"notas");
                tarea.subTarea = [];

                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Control de Monitoreo",TD.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Matriz",TD.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Informe",TD.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);

                ciclo.tareas.push(tarea);

            ciclos.push(ciclo);


            fechaInicial = new Date('2024-08-01');
            fechaFin = new Date('2024-08-30');
            ciclo     = await funcionesDeTest.crearCiclo(area1.id_area,"COMEX","COMEX",fechaInicial,fechaFin,1);
            ciclo.tareas = [];

                tarea     = await funcionesDeTest.crearTarea(SV.id_empleado,area1.id_area,ciclo.id_ciclo,"Comercio Exterior",1,1,fechaInicial,"notas");
                tarea.subTarea = [];
                
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"RELEVAMIENTO",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"NORMATIVA",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);

                ciclo.tareas.push(tarea);

                tarea     = await funcionesDeTest.crearTarea(SV.id_empleado,area1.id_area,ciclo.id_ciclo,"OPERACIONES CAMBIO",1,1,fechaInicial,"notas");
                tarea.subTarea = [];
               
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Tarea realizada",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Determinacion muestra",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Analisis operaciones",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Cotizaciones",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);

                ciclo.tareas.push(tarea);

                tarea     = await funcionesDeTest.crearTarea(SV.id_empleado,area1.id_area,ciclo.id_ciclo,"REGIMEN INFORMATIVO",1,1,fechaInicial,"notas");
                tarea.subTarea = [];
                
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"TR Regimen informativo",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"RI JUNIO",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"RRII IMPO SECOEXPO",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"CONTROL DE MONITOREO",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"MATRIZ",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"INFORME",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                
                ciclo.tareas.push(tarea);

            ciclos.push(ciclo);

            fechaInicial = new Date('2024-09-01');
            fechaFin = new Date('2024-09-31');
            ciclo     = await funcionesDeTest.crearCiclo(area1.id_area,"PUSF","PUSF",fechaInicial,fechaFin,1);
            ciclo.tareas = [];

                tarea     = await funcionesDeTest.crearTarea(SV.id_empleado,area1.id_area,ciclo.id_ciclo,"Proteccion de Usuarios de servicios financieros",1,1,fechaInicial,"notas");
                tarea.subTarea = [];
                
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"RELEVAMIENTO",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"NORMATIVA",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);

                ciclo.tareas.push(tarea);

                tarea     = await funcionesDeTest.crearTarea(SV.id_empleado,area1.id_area,ciclo.id_ciclo,"BASE RECLAMOS",1,1,fechaInicial,"notas");
                tarea.subTarea = [];
                
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Base",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);

                ciclo.tareas.push(tarea);

                tarea     = await funcionesDeTest.crearTarea(SV.id_empleado,area1.id_area,ciclo.id_ciclo,"Gestion Reclamos",1,1,fechaInicial,"notas");
                tarea.subTarea = [];

                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Cancelados",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Consulta",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Defensa consumidor",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Pendientes gestion",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Reintegros",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Resueltos",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                
                ciclo.tareas.push(tarea);

                tarea     = await funcionesDeTest.crearTarea(SV.id_empleado,area1.id_area,ciclo.id_ciclo,"CONTROLES",1,1,fechaInicial,"notas");
                tarea.subTarea = [];
                
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"DesigDirectivo",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"DesigRespons",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);

                ciclo.tareas.push(tarea);

                tarea     = await funcionesDeTest.crearTarea(SV.id_empleado,area1.id_area,ciclo.id_ciclo,"PUBLICIDAD",1,1,fechaInicial,"notas");
                tarea.subTarea = [];
                
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Apert y Cierre de cuentas",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Comis y Gtos",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Home b y App",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Publicidad",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"DCHOS BASICOS",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"RECAUDOS MINIMOS",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"REGIMEN INFORMATICO",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"CONTROL DE MONITOREO",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"MATRIZ",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"INFORME",SV.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    
                ciclo.tareas.push(tarea);
            
            ciclos.push(ciclo);

            fechaInicial = new Date('2024-08-01');
            fechaFin = new Date('2024-10-30');
            ciclo     = await funcionesDeTest.crearCiclo(area1.id_area,"DEPÓSITOS","DEPÓSITOS",fechaInicial,fechaFin,1);
            ciclo.tareas = [];

                tarea     = await funcionesDeTest.crearTarea(DM.id_empleado,area1.id_area,ciclo.id_ciclo,"Ciclo Depósitos - Caja de Ahorros",1,1,fechaInicial,"notas");
                tarea.subTarea = [];
                
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"RELEVAMIENTO",DM.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"NORMATIVA",DM.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);

                ciclo.tareas.push(tarea);
                
                tarea     = await funcionesDeTest.crearTarea(DM.id_empleado,area1.id_area,ciclo.id_ciclo,"CONCILIACION CONTABLE",1,1,fechaInicial,"notas");
                tarea.subTarea = [];

                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Conciliación Contable",DM.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Movimientos automáicos pendientes de Impaacto",DM.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);

                ciclo.tareas.push(tarea);

                tarea     = await funcionesDeTest.crearTarea(DM.id_empleado,area1.id_area,ciclo.id_ciclo,"ALTAS",1,1,fechaInicial,"notas");
                tarea.subTarea = [];

                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Altas Caja de Ahorros",DM.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    
                ciclo.tareas.push(tarea);

                tarea     = await funcionesDeTest.crearTarea(DM.id_empleado,area1.id_area,ciclo.id_ciclo,"INTERESES, GASTOS Y COMISIONES",1,1,fechaInicial,"notas");
                tarea.subTarea = [];
                
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Intereses sobre saldos",DM.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Gastos Mantenimiento Pesos",DM.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Gasto Mantenimiento Dolares",DM.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);

                ciclo.tareas.push(tarea);

                tarea     = await funcionesDeTest.crearTarea(DM.id_empleado,area1.id_area,ciclo.id_ciclo,"BAJAS",1,1,fechaInicial,"notas");
                tarea.subTarea = [];

                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Bajas Masivas de Cuentas",DM.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Bajas no presenciales",DM.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);

                ciclo.tareas.push(tarea);

                tarea     = await funcionesDeTest.crearTarea(DM.id_empleado,area1.id_area,ciclo.id_ciclo,"CUENTAS JUDICIALES",1,1,fechaInicial,"notas");
                tarea.subTarea = [];

                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Movimientos Impropios",DM.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Depósitos Judiciales en Dolares",DM.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"CONTROL DE MONITOREO",DM.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"RI PAGO REMUNERACIONES",DM.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);

                ciclo.tareas.push(tarea);

                tarea     = await funcionesDeTest.crearTarea(DM.id_empleado,area1.id_area,ciclo.id_ciclo,"TARJETA DE DEBITOS",1,1,fechaInicial,"notas");
                tarea.subTarea = [];

                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"STOCK DE TARJETAS VIRGENES",DM.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"CONTRATOS ",DM.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);

                ciclo.tareas.push(tarea);

                tarea     = await funcionesDeTest.crearTarea(DM.id_empleado,area1.id_area,ciclo.id_ciclo,"RESUMEN DE CUENTAS",1,1,fechaInicial,"notas");
                tarea.subTarea = [];

                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Resumenes de Cuenta",DM.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"MATRIZ",DM.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                    subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"INFORME",DM.id_empleado,4,0,1,1,fechaInicial,null,"esto son notas",1);
                    tarea.subTarea.push(subtarea);
                
                ciclo.tareas.push(tarea);

            ciclos.push(ciclo);

            baseDeDatos.ciclos = ciclos;
            
            res.json(baseDeDatos);


        }catch(error){
            console.log("entrando a la generacion de base de datos");
            console.log(error);
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({errorDetalleCompleto : error, error : codeError, errorDetalle: error.message});   
            return 1;
            
        }
    }
}

module.exports = controlador;

/*

let apisJSON = await fetch('${process.env.WEB}/apis/dateIn/newIndicador',{
    method:'POST',
    headers: {
        "Content-Type": "application/json"
    },
   body: JSON.stringify({
    user:{id: 4,nombre: 'Francisco Lema',area1: 1,puesto: 2,mail: 'franciscolemacr@gmail.com'}
    })
})

let apis = await apisJSON.json();
    
*/