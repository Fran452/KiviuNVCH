require("dotenv").config();
const dataBase = require("../database/models");
const funcionesDeTest = require('./funcionesTestGenericas')
const {Sequelize, DATE, Op} = require('sequelize');


const funcionesGenericas = require("../funcionesGenerales");


const controlador = {
    
    testGenerico: async (req,res) => {
        try{
            let addCicloJSON    = await fetch(`${process.env.WEB}/test/plan-accion/viewCiclos`,{
                method:'GET',
                headers: {
                    "Content-Type": "application/json"
                },
            });
            console.log("Fin de test addCiclo");

            let viewCiclosJSON  = await fetch(`${process.env.WEB}/test/plan-accion/addCiclos`,{
                method:'GET',
                headers: {
                    "Content-Type": "application/json"
                },
            });
            console.log("Fin de test viewCiclos");

            let editCicoJSON    = await fetch(`${process.env.WEB}/test/plan-accion/modCiclos`,{
                method:'GET',
                headers: {
                    "Content-Type": "application/json"
                },
            });
            console.log("Fin de test editCico");

            let deleteCicloJSON = await fetch(`${process.env.WEB}/test/plan-accion/deleteCiclos`,{
                method:'GET',
                headers: {
                    "Content-Type": "application/json"
                },
            });
            console.log("Fin de test deleteCiclo");

            // Tareas
            let addTareasJSON = await fetch(`${process.env.WEB}/test/plan-accion/addTask`,{
                method:'GET',
                headers: {
                    "Content-Type": "application/json"
                },
            });
            console.log("Fin de test addTareas");

            let viewTareasJSON = await fetch(`${process.env.WEB}/test/plan-accion/viewTareas`,{
                method:'GET',
                headers: {
                    "Content-Type": "application/json"
                },
            });
            console.log("Fin de test viewTareas");

            let ediTareasJSON = await fetch(`${process.env.WEB}/test/plan-accion/modTask`,{
                method:'GET',
                headers: {
                    "Content-Type": "application/json"
                },
            });
            console.log("Fin de test ediTareas");

            let deleteTareasJSON = await fetch(`${process.env.WEB}/test/plan-accion/deleteTask`,{
                method:'GET',
                headers: {
                    "Content-Type": "application/json"
                },
            });
            console.log("Fin de test deleteTareas");

            let addSubTareasJSON = await fetch(`${process.env.WEB}/test/plan-accion/addSubTask`,{
                method:'GET',
                headers: {
                    "Content-Type": "application/json"
                },
            });
            console.log("Fin de test addSubTareas");

            let viewSubTareasJSON = await fetch(`${process.env.WEB}/test/plan-accion/viewSubTask`,{
                method:'GET',
                headers: {
                    "Content-Type": "application/json"
                },
            });
            console.log("Fin de test viewSubTareas");

            let ediSubTareasJSON = await fetch(`${process.env.WEB}/test/plan-accion/modSubTask`,{
                method:'GET',
                headers: {
                    "Content-Type": "application/json"
                },
            });
            console.log("Fin de test ediSubTareas");

            
            let deleteSubTareasJSON = await fetch(`${process.env.WEB}/test/plan-accion/deleteSubTask`,{
                method:'GET',
                headers: {
                    "Content-Type": "application/json"
                },
            });
            console.log("Fin de test deleteSubTareas");


            let testPositivos = 0;
            let testNegativos = {
                contador : 0,
                resultado : []
            };
            let retornos = [];

            let addCiclo = await addCicloJSON.json();
            let viewCiclos = await viewCiclosJSON.json();
            let editCico = await editCicoJSON.json();
            let deleteCiclo = await deleteCicloJSON.json();

            let addTarea = await addTareasJSON.json();
            let viewTarea = await viewTareasJSON.json();
            let ediTarea = await ediTareasJSON.json();
            let deleteTarea = await deleteTareasJSON.json();

            let addSubTarea = await addSubTareasJSON.json();
            let viewSubTarea = await viewSubTareasJSON.json();
            let ediSubTarea = await ediSubTareasJSON.json();
            let deleteSubTarea = await deleteSubTareasJSON.json();

            retornos = [addCiclo,viewCiclos,editCico,deleteCiclo,addTarea,viewTarea,ediTarea,deleteTarea,addSubTarea,viewSubTarea,ediSubTarea,deleteSubTarea];
            for(let i = 0; i < retornos.length; i++){

                testPositivos += retornos[i].contadores.testCorrecto;
                if(retornos[i].contadores.testIncorrecto != 0){
                    testNegativos.contador += retornos[i].contadores.testIncorrecto;
                    testNegativos.resultado.push(retornos[i].contadores.testIncorrecto.resultado);
                }
            }
            if(testNegativos.contador == 0){
                testNegativos = 0;
            }


            let retorn = {
                contadores:{
                    testPositivos,
                    testNegativos
                },
                ciclos: {
                    add     : addCiclo,
                    view    : viewCiclos,
                    edit    : editCico,
                    delete  : deleteCiclo
                },
                tareas : {
                    add     : addTarea,
                    view    : viewTarea,
                    edit    : ediTarea,
                    delete  : deleteTarea
                },
                subTareas:{
                    add     : addSubTarea,
                    view    : viewSubTarea,
                    edit    : ediSubTarea,
                    delete  : deleteSubTarea
                }
            }
            console.log("Fin de test");
            res.json(retorn);  
        }
        catch(error){
            console.log(error);
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({errorDetalleCompleto : error, error : codeError, errorDetalle: error.message});   
            return 1;
            
        }
    },
    
    //* Test de Ciclos
    // Crear
    crearCiclo : async (req,res) => {
        let resultadoTest = {}

        let ahora = new Date()
        let fechaInicio = new Date(ahora.toISOString().split('T')[0]);
        ahora.setDate(ahora.getDate() + 7);
        let fechaFin = new Date(ahora.toISOString().split('T')[0]);

        let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();

        let usuario = {
            id: baseDeDatos[0].empleados[1].id_empleado,
            nombre:baseDeDatos[0].empleados[1].nombre,
            area:baseDeDatos[0].empleados[1].fk_area,
            puesto:baseDeDatos[0].empleados[1].fk_puesto,
            mail:baseDeDatos[0].empleados[1].mail  
        };

        let apisJSON = await fetch(`${process.env.WEB}/apis/plan-accion/addCiclos`,{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre      : "Ciclo de ejemplo",
                detalles    : "Ciclo de ejemplo detalles",
                fechaInicio : fechaInicio,
                fechaFinal  : fechaFin,
                user        : usuario
            })
        })
        
        let apis = await apisJSON.json();
        
        // Sin error de apis
        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apis.error,1);
        if(resultadoTest.test0.estado == 'Error'){
            res.json({resultadoTest,resultadoApi:apis});
            return 1;
        };

        // Busco el ciclo
        cicloEncontrado = await funcionesDeTest.buscarCiclo(apis.objeto.id_ciclo);
        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Se encontro el ciclo creado',undefined,cicloEncontrado,4);
        
        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Nombre subido','Ciclo de ejemplo',cicloEncontrado.nombre,1);
        
        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Detalle subido','Ciclo de ejemplo detalles',cicloEncontrado.detalles,1);
        
        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Area subida',usuario.area,cicloEncontrado.fk_area,1);
        
        // Eliminar ejemplo
        await funcionesDeTest.eliminarCiclo(cicloEncontrado.id_ciclo);

        await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);

        let contadores = funcionesDeTest.contadorDeTest(resultadoTest);
        res.json({contadores,resultadoTest,resultadoApi:apis});
        return 0;
    },
    // Ver
    verCiclos: async (req,res) => {
        let resultadoTest = {}

        let ahora = new Date()
        let fechaInicio = ahora
        ahora.setDate(ahora.getDate() + 7);
        let fechaFin = ahora
        
        let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();

        let usuario = {
            id:     baseDeDatos[0].empleados[1].id_empleado,
            nombre: baseDeDatos[0].empleados[1].nombre,
            area:   baseDeDatos[0].empleados[1].fk_area,
            puesto: baseDeDatos[0].empleados[1].fk_puesto,
            mail:   baseDeDatos[0].empleados[1].mail  
        };

        let usuarioOtraArea = {
            id:     baseDeDatos[1].empleados[1].id_empleado,
            nombre: baseDeDatos[1].empleados[1].nombre,
            area:   baseDeDatos[1].empleados[1].fk_area,
            puesto: baseDeDatos[1].empleados[1].fk_puesto,
            mail:   baseDeDatos[1].empleados[1].mail  
        };

        let cicloSubicos = await funcionesDeTest.crearCiclo(usuario.area,"Ciclo de ejemplo","ciclo de ejemplo detalle",fechaInicio,fechaFin,1);
        let cicloSubicosNoVer = await funcionesDeTest.crearCiclo(usuario.area,"Ciclo de ejemplo No mostrar","ciclo de ejemplo detalle",fechaInicio,fechaFin,0);

        let apisJSON = await fetch(`${process.env.WEB}/apis/plan-accion/viewCiclos`,{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user:   usuario
            })
        });
        
        let apis = await apisJSON.json();
        
        // Sin error de apis
        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apis.error,1);
        if(resultadoTest.test0.estado == 'Error'){
            res.json({resultadoTest,resultadoApi:apis});
            return 1;
        };

        // Ciclos encontrados
        let encontrarCiclo = apis.objeto.find(ciclos => ciclos.id_ciclo == cicloSubicos.id_ciclo);
        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Objeto de test mostrado',undefined,encontrarCiclo,4);
        
        // Ciclos que no se tiene que mostrar
        let noMostrarCiclo = apis.objeto.find(ciclos => ciclos.id_ciclo == cicloSubicosNoVer.id_ciclo);
        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Objeto de test que no se tiene que mostrar',undefined,noMostrarCiclo,1);


        let apis2JSON = await fetch(`${process.env.WEB}/apis/plan-accion/viewCiclos`,{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user:   usuarioOtraArea
            })
        });
        
        let apis2 = await apis2JSON.json();

        // Ciclos encontrados
        encontrarCiclo = apis2.objeto.find(ciclos => ciclos.id_ciclo == cicloSubicos.id_ciclo);
        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Objeto de test no mostrado para otra area',undefined,encontrarCiclo,1);

        
        // Eliminar ejemplo
        await funcionesDeTest.eliminarCiclo(cicloSubicos.id_ciclo);
        await funcionesDeTest.eliminarCiclo(cicloSubicosNoVer.id_ciclo);

        await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);

        let contadores = funcionesDeTest.contadorDeTest(resultadoTest);
        res.json({contadores,resultadoTest,resultadoApi:{apisMismaArea:apis,apisDiferenteArea:apis2}});
        return 0;
    },
    // Editar
    editarCiclos: async (req,res) => {
        let resultadoTest = {}

        let ahora = new Date()
        let fechaInicio = ahora.toISOString().split('T')[0];
        ahora.setDate(ahora.getDate() + 7);
        let fechaFin = ahora.toISOString().split('T')[0];

        let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();

        let usuario = {
            id: baseDeDatos[0].empleados[1].id_empleado,
            nombre:baseDeDatos[0].empleados[1].nombre,
            area:baseDeDatos[0].empleados[1].fk_area,
            puesto:baseDeDatos[0].empleados[1].fk_puesto,
            mail:baseDeDatos[0].empleados[1].mail  
        };

        let cicloSubidosAntes = await funcionesDeTest.crearCiclo(usuario.area,"Ciclo de ejemplo","ciclo de ejemplo detalle",fechaInicio,fechaFin,1);
        
        let apisJSON = await fetch(`${process.env.WEB}/apis/plan-accion/modCiclos`,{
            method:'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({  
                nombre      : "Cambiado",   
                detalles    : "Cambiado detalle",
                fechaInicio : fechaInicio,
                fechaFinal  : fechaFin,       
                id_ciclo    : cicloSubidosAntes.id_ciclo,       
                user        : usuario
            })
        })

        let apis = await apisJSON.json();

        // Sin error de apis
        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apis.error,1);
        
        if(resultadoTest.test0.estado == 'Error'){
            res.json({resultadoTest,resultadoApi:apis});
            return 1;
        };

        let cicloSubidosDespues = await funcionesDeTest.buscarCiclo(cicloSubidosAntes.id_ciclo);
        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Titulo modificado' ,'Cambiado',cicloSubidosDespues.nombre,1);
        
        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Detalle modificado','Cambiado detalle',cicloSubidosDespues.detalles,1);

        // Eliminar ejemplo
        await funcionesDeTest.eliminarCiclo(cicloSubidosAntes.id_ciclo);

        await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);

        let contadores = funcionesDeTest.contadorDeTest(resultadoTest);
        res.json({contadores,resultadoTest,resultadoApi:apis});
        return 0;
    },
    // Eliminar
    eliminarCiclos: async (req,res) => {
        let resultadoTest = {}

        let ahora = new Date()
        let fechaInicio = ahora.toISOString().split('T')[0];
        ahora.setDate(ahora.getDate() + 7);
        let fechaFin = ahora.toISOString().split('T')[0];

        let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();

        let usuario = {
            id: baseDeDatos[0].empleados[1].id_empleado,
            nombre:baseDeDatos[0].empleados[1].nombre,
            area:baseDeDatos[0].empleados[1].fk_area,
            puesto:baseDeDatos[0].empleados[1].fk_puesto,
            mail:baseDeDatos[0].empleados[1].mail  
        };

        let cicloSubidosAntes = await funcionesDeTest.crearCiclo(usuario.area,"Ciclo de ejemplo","ciclo de ejemplo detalle",fechaInicio,fechaFin,1);

        let apisJSON = await fetch(`${process.env.WEB}/apis/plan-accion/deleteCiclos`,{
            method:'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_ciclo:   cicloSubidosAntes.id_ciclo,
                user:       usuario
            })
        })
        
        let apis = await apisJSON.json();
        
        // Sin error de apis
        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apis.error,1);
        if(resultadoTest.test0.estado == 'Error'){
            res.json({resultadoTest,resultadoApi:apis});
            return 1;
        };

        let cicloSubidosDespues = await funcionesDeTest.buscarCiclo(cicloSubidosAntes.id_ciclo);
        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Modificion del campo de ver' ,0,cicloSubidosDespues.ver,1);


        // Eliminar ejemplo
        await funcionesDeTest.eliminarCiclo(cicloSubidosAntes.id_ciclo);

        await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);

        let contadores = funcionesDeTest.contadorDeTest(resultadoTest);
        res.json({contadores,resultadoTest,resultadoApi:apis});
        return 0;
    },

    //* Test de Tareas
    // Crear
    createTarea: async (req,res) => {
        try{
            let resultadoTest = {}

            // Base de datos
            let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico(); 
            let ahora = new Date()
            let fechaInicio = new Date(ahora.toISOString().split('T')[0]);
            ahora.setDate(ahora.getDate() + 7);
            let fechaDelFinal = new Date(ahora.toISOString().split('T')[0]);

            let usuario = {
                id:     baseDeDatos[0].empleados[2].id_empleado,
                nombre: baseDeDatos[0].empleados[2].nombre,
                area:   baseDeDatos[0].empleados[2].fk_area,
                puesto: baseDeDatos[0].empleados[2].fk_Puesto,
                mail:   baseDeDatos[0].empleados[2].mail  
            };

            let usuario2 = {
                id:     baseDeDatos[2].empleados[2].id_empleado,
                nombre: baseDeDatos[2].empleados[2].nombre,
                area:   baseDeDatos[2].empleados[2].fk_area,
                puesto: baseDeDatos[2].empleados[2].fk_Puesto,
                mail:   baseDeDatos[2].empleados[2].mail  
            };

            // Crear proyecto de prueba
            let crearCiclo     = await funcionesDeTest.crearCiclo(usuario.area,'ciclo prueba','ciclo de prueba',fechaInicio,fechaDelFinal,1);



            // Inicio del test
            let apisJSON = await fetch(`${process.env.WEB}/apis/plan-accion/addTask`,{
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    empleado_asignado   : usuario.mail,  
                    idCiclo             : crearCiclo.id_ciclo,
                    nombre              : 'Tarea de prueba',
                    estado              : 1,
                    prioridad           : 1,    
                    fechaInicial        : fechaInicio,
                    notas               : 'Tarea de prueba para hacer los test',
                    user                : usuario
                })
            });
            
            let apis = await apisJSON.json();
            
            // Sin error de apis
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apis.error,1);
            if(resultadoTest.test0.estado == 'Error'){
                res.json({resultadoTest,resultadoApi:apis});
                return 1;
            };

            // Se subio a la base de datos
            let tareaEjemplo = await funcionesDeTest.buscarTarea(apis.objeto.id_tarea);

            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Se subio a la base de datos',undefined,tareaEjemplo,4);
            
            // Se subio con el nombre correcto
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Se subio con el nombre correcto','Tarea de prueba',tareaEjemplo.nombre,1);

            // Se subio con el descripcion correcto
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Se subio con la descripcion correcto','Tarea de prueba para hacer los test',tareaEjemplo.notas,1);

            // Se subio bien el area
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Se subio con el area correcto',usuario.area,tareaEjemplo.Areas.id_area,1);


            // Error de usuario no existente
            let apisErrorJSON = await fetch(`${process.env.WEB}/apis/plan-accion/addTask`,{
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    empleado_asignado   : 'noExiste@gmail.com',
                    fechaInicial        : fechaInicio,
                    nombre              : 'Tarea de prueba',
                    estado              : 1,
                    prioridad           : 1,    
                    notas               : 'Tarea de prueba para hacer los test',
                    idCiclo             : crearCiclo.id_ciclo,     
                    user                : usuario
                })
            });

            let apisError = await apisErrorJSON.json();
    
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Error de inexistencia de mail',10,apisError.error,1);

            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Error de inexistencia de mail detalle','El correo del responsable no existe.',apisError.errorDetalle,1);
            
            // Error de usuario no existente
            let apisError3JSON = await fetch(`${process.env.WEB}/apis/plan-accion/addTask`,{
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    empleado_asignado   : usuario2.mail,
                    fechaInicial        : fechaInicio,
                    nombre              : 'Tarea de prueba',
                    estado              : 1,
                    prioridad           : 1,    
                    notas               : 'Tarea de prueba para hacer los test',
                    fk_ciclo            : crearCiclo.id_ciclo,   
                    user                : usuario
                })
            });

            let apisError3 = await apisError3JSON.json();
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Error de inexistencia de mail',99,apisError3.error,1);

            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Error de usuario de otra area','Usuario indicado no perteneciente al area',apisError3.errorDetalle,1);
            

            // eliminar ejemplo
            await funcionesDeTest.eliminarTarea(tareaEjemplo.id_tarea);

            await funcionesDeTest.eliminarCiclo(crearCiclo.id_ciclo);
            await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);

            let contadores = funcionesDeTest.contadorDeTest(resultadoTest);
            res.json({contadores,resultadoTest,resultadoApi:apis});

        }
        catch(error){
            console.log(error);
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({errorDetalleCompleto : error, error : codeError, errorDetalle: error.message});   
            return 1;
        }

    },
    // Ver    
    readTarea: async (req,res) => {
        try{
            let resultadoTest = {}

            // Armado de ambiente test
            let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();
        
            // Areas Usadas 
            let area        = baseDeDatos[0].area.id_area
            let areaApoyo   = baseDeDatos[1].area.id_area
            let usuario = {
                id:     baseDeDatos[0].empleados[2].id_empleado,
                nombre: baseDeDatos[0].empleados[2].nombre,
                area:   baseDeDatos[0].empleados[2].fk_area,
                puesto: baseDeDatos[0].empleados[2].fk_Puesto,
                mail:   baseDeDatos[0].empleados[2].mail  
            };
            
            // fecha usada
            let ahora = new Date();
            let fechaInicio = ahora.toISOString().split('T')[0];
            ahora.setDate(ahora.getDate() + 7);
            let fechaFin = ahora.toISOString().split('T')[0];

            // proyecto para las tareas 
            let creaCiclo  = await funcionesDeTest.crearCiclo(usuario.area,"ciclo test","ciclo test prueba",fechaInicio,fechaFin,1)
            // tareas de ejemplo
            let tarea1 = await funcionesDeTest.crearTarea(usuario.id,area,creaCiclo.id_ciclo,`proyecto de prueba n1`,1,1,fechaInicio,fechaFin,'texto de pruebas para tareas');
            let tarea2 = await funcionesDeTest.crearTarea(usuario.id,area,creaCiclo.id_ciclo,`proyecto de prueba n2`,1,1,fechaInicio,fechaFin,'texto de pruebas para tareas');
            let tarea3 = await funcionesDeTest.crearTarea(usuario.id,area,creaCiclo.id_ciclo,`proyecto de prueba n3`,1,1,fechaInicio,fechaFin,'texto de pruebas para tareas');


            let subtarea1  = await funcionesDeTest.crearSubTarea(tarea1.id_tarea,"sub tarea ejemplo",usuario.id,5,100,1,1,fechaInicio,fechaFin,"esto son notas",1);
            let subtarea2  = await funcionesDeTest.crearSubTarea(tarea1.id_tarea,"sub tarea ejemplo",usuario.id,5,100,1,1,fechaInicio,fechaFin,"esto son notas",1);
            let subtarea3  = await funcionesDeTest.crearSubTarea(tarea1.id_tarea,"sub tarea ejemplo",usuario.id,5,100,1,1,fechaInicio,fechaFin,"esto son notas",1);

            let subtarea4  = await funcionesDeTest.crearSubTarea(tarea2.id_tarea,"sub tarea ejemplo",usuario.id,5,0,1,1,fechaInicio,fechaFin,"esto son notas",1);
            let subtarea5  = await funcionesDeTest.crearSubTarea(tarea2.id_tarea,"sub tarea ejemplo",usuario.id,5,100,1,1,fechaInicio,fechaFin,"esto son notas",1);
            let subtarea6  = await funcionesDeTest.crearSubTarea(tarea2.id_tarea,"sub tarea ejemplo",usuario.id,5,100,1,1,fechaInicio,fechaFin,"esto son notas",0);
            
            let apisJSON = await fetch(`${process.env.WEB}/apis/plan-accion/viewTask`,{
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idCiclo: creaCiclo.id_ciclo,
                    user:       usuario
                })
            });
            
            let apis = await apisJSON.json();

            // Sin error de apis
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apis.error,1);
            if(resultadoTest.test0.estado == 'Error'){
                res.json({resultadoTest,resultadoApi:apis});
                return 1;
            };

            // Mostrar primer elemento
            let tarea1BD = apis.objeto.find(tarea => tarea.id_tarea == tarea1.id_tarea);
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Mostrar primer elemento',undefined,tarea1BD,4);
            
            // Mostrar horas de las 3 subtareas
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Mostrar horas de las subTareas (Tarea 1)',15,tarea1BD.horas_tarea,1);

            // Mostar porsentaje de avance
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Mostrar progreso de las subTareas (Tarea 1)',fechaFin,tarea1BD.fecha_final,1);
            
            // Mostar Fecha final
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Mostrar progreso de las subTareas (Tarea 1)',100,tarea1BD.progreso_tarea,1);
            

            // Mostrar segundo elemento
            let tarea2BD = apis.objeto.find(tarea => tarea.id_tarea == tarea2.id_tarea);
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Mostrar segundo elemento',undefined,tarea2BD,4);

            // Mostrar horas de las 2 subtareas
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Mostrar horas de las subTareas (Tarea 2)',10,tarea2BD.horas_tarea,1);

            // Mostar porsentaje de avance
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Mostrar progreso de las subTareas (Tarea 2)',50,tarea2BD.progreso_tarea,1);

            // Mostar Fecha final
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Mostrar progreso de las subTareas (Tarea 2)',null,tarea2BD.fecha_final,1);

            // Mostrar tercer elemento
            let tarea3BD = apis.objeto.find(tarea => tarea.id_tarea == tarea3.id_tarea);
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Mostrar tercero elemento',undefined,tarea3BD,4);

            // Mostrar horas sin subtareas 
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Mostrar horas de las subTareas (Tarea 3)',0,tarea3BD.horas_tarea,1);

            // Mostar porsentaje de avance
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Mostrar progreso de las subTareas (Tarea 3)',0,tarea3BD.progreso_tarea,1);



            // Eliminar ejemplos
            await funcionesDeTest.eliminarSubTareas(subtarea1.id_sub_tarea);
            await funcionesDeTest.eliminarSubTareas(subtarea2.id_sub_tarea);
            await funcionesDeTest.eliminarSubTareas(subtarea3.id_sub_tarea);
            await funcionesDeTest.eliminarSubTareas(subtarea4.id_sub_tarea);
            await funcionesDeTest.eliminarSubTareas(subtarea5.id_sub_tarea);
            await funcionesDeTest.eliminarSubTareas(subtarea6.id_sub_tarea);
            
            
            await funcionesDeTest.eliminarTarea(tarea1BD.id_tarea);
            await funcionesDeTest.eliminarTarea(tarea2BD.id_tarea);
            await funcionesDeTest.eliminarTarea(tarea3BD.id_tarea);
            
            await funcionesDeTest.eliminarCiclo(creaCiclo.id_ciclo);
            await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);

            let contadores = funcionesDeTest.contadorDeTest(resultadoTest);
            res.json({contadores,resultadoTest,resultadoApi:apis});
        }
        catch(error){
            console.log(error);
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({errorDetalleCompleto : error, error : codeError, errorDetalle: error.message});   
            return 1;
        }

    },
    // Editar
    editeTarea: async (req,res) => {
        try{    
            let resultadoTest = {}

            // Armado de ambiente test
            let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();
        
            // Areas Usadas 
            let area        = baseDeDatos[0].area.id_area;
            let areaApoyo   = baseDeDatos[0].area.id_area;
            let usuario = {
                id:     baseDeDatos[0].empleados[2].id_empleado,
                nombre: baseDeDatos[0].empleados[2].nombre,
                area:   baseDeDatos[0].empleados[2].fk_area,
                puesto: baseDeDatos[0].empleados[2].fk_Puesto,
                mail:   baseDeDatos[0].empleados[2].mail  
            };

            // fecha usada
            let ahora = new Date();
            let fechaInicio = ahora.toISOString().split('T')[0];
            ahora.setDate(ahora.getDate() + 7);
            let fechaFin = ahora.toISOString().split('T')[0];

            // proyecto para las tareas 
            let crearCiclo  = await funcionesDeTest.crearCiclo(area,"ciclo de test","ciclo de test Detalle",fechaInicio,fechaFin,1)

            // tareas de ejemplo
            let tareaCreada = await funcionesDeTest.crearTarea(usuario.id,area,crearCiclo.id_ciclo,`tarea de prueba`,1,1,fechaInicio,fechaFin,'texto de pruebas para tareas');
            let tareaAntes  = await funcionesDeTest.buscarTarea(tareaCreada.id_tarea);
            
            let apisJSON = await fetch(`${process.env.WEB}/apis/plan-accion/modTask`,{
                method:'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    tarea             : tareaAntes,
                    empleado_asignado : usuario.mail,             
                    nombre            : 'tarea de prueba editado', 
                    estado            : 0, 
                    prioridad         : 0,     
                    //fechaInicio       : fechaInicio,     
                    fechaFinal        : fechaFin,     
                    notas             : 'cambiando la nota', 
                    areaApoyo         : areaApoyo,     
                    progreso          : 40,     
                    idProyecto        : crearCiclo.id_ciclo,     
                    user              : usuario
                })
            })
            
            let apis = await apisJSON.json();
            // Sin error de apis
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apis.error,1);

            if(resultadoTest.test0.estado == 'Error'){
                res.json({resultadoTest,resultadoApi:apis});
                return 1;
            };

            let tareaDespues = await funcionesDeTest.buscarTarea(tareaAntes.id_tarea);
            

            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Cambio de la tarea de forma correcta','tarea de prueba editado',tareaDespues.nombre,1);

            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Diferencia con la tarea origianl',tareaAntes.nombre,tareaDespues.nombre,4);
            
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'texto de pruebas para tareas','cambiando la nota',tareaDespues.notas,1);

            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Diferencia entre texto antes y despues de edicion',tareaAntes.notas,tareaDespues.notas,4);

            
            // Eliminar ejemplos
            await funcionesDeTest.eliminarTarea(tareaAntes.id_tarea);

            await funcionesDeTest.eliminarCiclo(crearCiclo.id_ciclo);
            await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);    

            let contadores = funcionesDeTest.contadorDeTest(resultadoTest);
            res.json({contadores,resultadoTest,resultadoApi:apis});
        }
        catch(error){
            console.log(error);
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({errorDetalleCompleto : error, error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },
    // Eliminar
    deleteTarea: async (req,res) => {
        try{
            let resultadoTest = {}

            // Armado de ambiente test
            let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();
            
            // Areas Usadas 
            let area        = baseDeDatos[0].area.id_area;
            let areaApoyo   = baseDeDatos[0].area.id_area;
            let usuario = {
                id:     baseDeDatos[0].empleados[2].id_empleado,
                nombre: baseDeDatos[0].empleados[2].nombre,
                area:   baseDeDatos[0].empleados[2].fk_area,
                puesto: baseDeDatos[0].empleados[2].fk_Puesto,
                mail:   baseDeDatos[0].empleados[2].mail  
            };

            // fecha usada
            let ahora = new Date();
            let fechaInicio = ahora.toISOString().split('T')[0];
            ahora.setDate(ahora.getDate() + 7);
            let fechaFin = ahora.toISOString().split('T')[0];

            // proyecto para las tareas 
            let crearCiclo = await funcionesDeTest.crearCiclo(area,"ciclo de test","ciclo de test Detalle",fechaInicio,fechaFin,1)

            // tareas de ejemplo
            let tareaCreada = await funcionesDeTest.crearTarea(usuario.id,area,crearCiclo.id_ciclo,`tarea de prueba`,1,1,fechaInicio,fechaFin,'texto de pruebas para tareas');
            let tareaAntes = await funcionesDeTest.buscarTarea(tareaCreada.id_tarea);

            let apisJSON = await fetch(`${process.env.WEB}/apis/plan-accion/deleteTask`,{
                method:'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idTarea : tareaAntes.id_tarea,
                    user    : usuario  
                })
            })
            
            let apis = await apisJSON.json();
            
            // Sin error de apis
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apis.error,1);
            
            if(resultadoTest.test0.estado == 'Error'){
                res.json({resultadoTest,resultadoApi:apis});
                return 1;
            };

            let tareaDespues = await funcionesDeTest.buscarTarea(tareaCreada.id_tarea);

            // Modificacion de ver
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Modificacion de ver',0,tareaDespues.ver,1);


            let apisReadJSON = await fetch(`${process.env.WEB}/apis/plan-accion/viewTask`,{
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idCiclo: crearCiclo.id_ciclo,
                    user:       usuario
                })
            })
            
            let apisRead = await apisReadJSON.json();

            let tarea1BD = apisRead.objeto.find(tarea => tarea.id_tarea == tareaDespues.id_tarea);

            // No se ve desde la APIS
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'No se ve desde la APIS',undefined,tarea1BD,1);


            // Eliminar ejemplos
            await funcionesDeTest.eliminarTarea(tareaDespues.id_tarea);

            await funcionesDeTest.eliminarCiclo(crearCiclo.id_ciclo);
            await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);    

            let contadores = funcionesDeTest.contadorDeTest(resultadoTest);
            res.json({contadores,resultadoTest,resultadoApi:apis});
        }
        catch(error){
            console.log(error);
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({errorDetalleCompleto : error, error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    //* Test de Sub Tareas
    // Crear    
    addSubTarea: async (req,res) => {
        try{
            let resultadoTest = {}

            // Armado de ambiente test
            let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();
            let usuario = {
                id:     baseDeDatos[0].empleados[2].id_empleado,
                nombre: baseDeDatos[0].empleados[2].nombre,
                area:   baseDeDatos[0].empleados[2].fk_area,
                puesto: baseDeDatos[0].empleados[2].fk_Puesto,
                mail:   baseDeDatos[0].empleados[2].mail  
            };


            // fecha usada
            let ahora = new Date();
            let fechaInicio = ahora.toISOString().split('T')[0];
            ahora.setDate(ahora.getDate() + 7);
            let fechaFin = ahora.toISOString().split('T')[0];

            let crearCiclo = await funcionesDeTest.crearCiclo(usuario.area,"ciclo de test","ciclo de test Detalle",fechaInicio,fechaFin,1);
            let tareaCreadaAntigua = await funcionesDeTest.crearTarea(usuario.id,usuario.area,crearCiclo.id_ciclo,`tarea de prueba`,1,1,fechaFin,'texto de pruebas para tareas');
            let apisJSON = await fetch(`${process.env.WEB}/apis/plan-accion/addSubTask`,{
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_tareas       : tareaCreadaAntigua.id_tarea,          
                    titulo          : "Sub tarea de ejemplo",      
                    asignacion      : usuario.mail,          
                    horasAprox      : 4,          
                    avance          : 0,      
                    estado          : 0,      
                    prioridad       : 0,          
                    notas           : "Nota ",      
                    user            : usuario,
                    fechaInicial    : ahora
                })
            })
            
            let apis = await apisJSON.json();
            
            // Sin error de apis    
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apis.error,1);
            if(resultadoTest.test0.estado == 'Error'){
                res.json({resultadoTest,resultadoApi:apis});
                return 1;
            };
            
            let subtarea = await funcionesDeTest.buscarSubTarea(apis.objeto.id_sub_tarea);

            // Sub tarea subida correcto
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Sub tarea subida correcto',undefined,subtarea,4);

            // SubTarea subida con el nombre
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'SubTarea subida con el nombre',"Sub tarea de ejemplo",subtarea.titulo,1);

            // SubTarea asignada bien 
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'SubTarea asignada bien',usuario.id,subtarea.Empleados.id_empleado,1);


            // Eliminar ejemplos
             
            await funcionesDeTest.eliminarSubTareas(subtarea.id_sub_tarea);
            
            await funcionesDeTest.eliminarTarea(tareaCreadaAntigua.id_tarea);

            await funcionesDeTest.eliminarCiclo(crearCiclo.id_ciclo);

            await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);    

            let contadores = funcionesDeTest.contadorDeTest(resultadoTest);
            res.json({contadores,resultadoTest,resultadoApi:apis});
        }
        catch(error){
            console.log(error);
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({errorDetalleCompleto : error, error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },
    // Ver
    editSubTarea: async (req,res) => {
        try{
            let resultadoTest = {};
            
            const opciones = {
                timeZone: 'America/Argentina/Buenos_Aires',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            };
            let ahora = new Date();
            let fechaArgentina  = new Intl.DateTimeFormat('es-AR', opciones).format(new Date());
            ahora = new Date(fechaArgentina);
            let fechaInicio = ahora.toISOString().split('T')[0];
            ahora.setDate(ahora.getDate() + 7);
            let fechaFin = ahora.toISOString().split('T')[0];

            let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();
            let usuario = {
                id: baseDeDatos[0].empleados[1].id_empleado,
                nombre:baseDeDatos[0].empleados[1].nombre,
                area:baseDeDatos[0].empleados[1].fk_area,
                puesto:baseDeDatos[0].empleados[1].fk_puesto,
                mail:baseDeDatos[0].empleados[1].mail  
            };

            let ciclo     = await funcionesDeTest.crearCiclo(usuario.area,"Ciclo ejemplo","Ciclo ejemplo",fechaInicio,fechaFin,1);
            
            let tarea     = await funcionesDeTest.crearTarea(usuario.id,usuario.area,ciclo.id_ciclo,"Tarea de ejemplo",1,1,"notas");
            let crearSubtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"sub tarea ejemplo",usuario.id,4,5,1,1,fechaInicio,null,"esto son notas",1);
            let subtareaAntes   = await funcionesDeTest.buscarSubTarea(crearSubtarea.id_sub_tarea);
            
            
            let apisJSON = await fetch(`${process.env.WEB}/apis/plan-accion/modSubTask`,{
                method:'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    subtarea        : subtareaAntes,
                    titulo          : 'cambio de titulo',
                    asignacion      : usuario.mail,    
                    horasAprox      : 5,    
                    avance          : 50,
                    estado          : 2,
                    prioridad       : 2,    
                    notas           : 'Notas editadas',
                    user            : usuario  
                })
            });
            
            let apis = await apisJSON.json();
            
            // Sin error de apis
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apis.error,1);
            if(resultadoTest.test0.estado == 'Error'){
                res.json({resultadoTest,resultadoApi:apis});
                return 1;
            };

            let subtareaMod  = await funcionesDeTest.buscarSubTarea(subtareaAntes.id_sub_tarea);
            console.log(subtareaMod);
            // Modificacion de titulo
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Modificacion de titulo','cambio de titulo',subtareaMod.titulo,1);

            // Modificacion de horasAprox
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Modificacion de horasAprox',5,subtareaMod.horasAprox,1);

            // Modificacion de avece
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Modificacion de avece',50,subtareaMod.avance,1);

            // Modificacion de estado
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Modificacion de estado',2,subtareaMod.estado,1);


            await fetch(`${process.env.WEB}/apis/plan-accion/modSubTask`,{
                method:'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    subtarea        : subtareaAntes,
                    titulo          : 'cambio de titulo',
                    asignacion      : usuario.mail,    
                    horasAprox      : 5,    
                    avance          : 100,
                    estado          : 2,
                    prioridad       : 2,    
                    notas           : 'Notas editadas',
                    user            : usuario  
                })
            });
            
            subtareaMod  = await funcionesDeTest.buscarSubTarea(subtareaAntes.id_sub_tarea);
            console.log(subtareaMod);

            // Agregar fecha al momento de modificar al 100% el avance
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Agregar fecha al momento de modificar al 100% el avance',fechaInicio,subtareaMod.fecha_final,1);

            let apisTareasJSON = await fetch(`${process.env.WEB}/apis/plan-accion/viewTask`,{
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idCiclo: ciclo.id_ciclo,
                    user:       usuario
                })
            });

            let tareas = await apisTareasJSON.json(); 
            let tareaView = tareas.objeto[0];

            // Agregar fecha de la tarea
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Ver fecha final en la Tarea',fechaInicio,tareaView.fecha_final,1);


            // Eliminar ejemplos
            await funcionesDeTest.eliminarSubTareas(subtareaMod.id_sub_tarea);
            await funcionesDeTest.eliminarTarea(tarea.id_tarea);
            await funcionesDeTest.eliminarCiclo(ciclo.id_ciclo);
            
            await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);
            
            let contadores = funcionesDeTest.contadorDeTest(resultadoTest);
            res.json({contadores,resultadoTest,resultadoApi:apis});
        }
        catch(error){
            console.log(error);
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({errorDetalleCompleto : error, error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },
    // Editar
    viewSubTarea: async (req,res) => {
        try{
            let resultadoTest = {};

            let ahora = new Date();
            let fechaInicio = ahora.toISOString().split('T')[0];
            ahora.setDate(ahora.getDate() + 7);
            let fechaFin = ahora.toISOString().split('T')[0];

            let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();
            let usuario = {
                id: baseDeDatos[0].empleados[1].id_empleado,
                nombre:baseDeDatos[0].empleados[1].nombre,
                area:baseDeDatos[0].empleados[1].fk_area,
                puesto:baseDeDatos[0].empleados[1].fk_puesto,
                mail:baseDeDatos[0].empleados[1].mail  
            };
            let ciclo     = await funcionesDeTest.crearCiclo(usuario.area,"Ciclo ejemplo","Ciclo ejemplo",fechaInicio,fechaFin,1);
            
            let tarea     = await funcionesDeTest.crearTarea(usuario.id,usuario.area,ciclo.id_ciclo,"Tarea de ejemplo",1,1,"notas");
            
            let subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"sub1 tarea ejemplo",usuario.id,4,5,1,1,fechaInicio,fechaFin,"esto son notas",1);
            let subtarea2  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"sub2 tarea ejemplo",usuario.id,4,5,1,1,fechaInicio,fechaFin,"esto son notas",1);
            let subtarea3  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"sub2 tarea ejemplo",usuario.id,4,5,1,1,fechaInicio,fechaFin,"esto son notas",1);

            let apisJSON = await fetch(`${process.env.WEB}/apis/plan-accion/viewSubTask`,{
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idTarea :   tarea.id_tarea,
                    user    :   usuario  
                })
            })
            
            let apis = await apisJSON.json();
            
            // Sin error de apis
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apis.error,1);
            
            if(resultadoTest.test0.estado == 'Error'){
                res.json({resultadoTest,resultadoApi:apis});
                return 1;
            };

            let subtareaBuscada = apis.objeto.find(subtarea => subtarea.id_sub_tarea == subtarea.id_sub_tarea);

            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Ver subTarea 1',undefined,subtareaBuscada,4);

            subtareaBuscada = apis.objeto.find(subtarea => subtarea.id_sub_tarea == subtarea2.id_sub_tarea);
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Ver subTarea 2',undefined,subtareaBuscada,4);

            subtareaBuscada = apis.objeto.find(subtarea => subtarea.id_sub_tarea == subtarea3.id_sub_tarea);
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Ver subTarea 3',undefined,subtareaBuscada,4);

            // Eliminar ejemplos
            await funcionesDeTest.eliminarSubTareas(subtarea.id_sub_tarea);
            await funcionesDeTest.eliminarSubTareas(subtarea2.id_sub_tarea);
            await funcionesDeTest.eliminarSubTareas(subtarea3.id_sub_tarea);

            await funcionesDeTest.eliminarTarea(tarea.id_tarea);

            await funcionesDeTest.eliminarCiclo(ciclo.id_ciclo);
            
            await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);
           
            let contadores = funcionesDeTest.contadorDeTest(resultadoTest);
            res.json({contadores,resultadoTest,resultadoApi:apis});
        }
        catch(error){
            console.log(error);
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({errorDetalleCompleto : error, error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },
     // Eliminar
    deleteSubTarea: async (req,res) => {
        try{
            let resultadoTest = {};

            let ahora = new Date();
            let fechaInicio = ahora.toISOString().split('T')[0];
            ahora.setDate(ahora.getDate() + 7);
            let fechaFin = ahora.toISOString().split('T')[0];

            let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();
            let usuario = {
                id: baseDeDatos[0].empleados[1].id_empleado,
                nombre:baseDeDatos[0].empleados[1].nombre,
                area:baseDeDatos[0].empleados[1].fk_area,
                puesto:baseDeDatos[0].empleados[1].fk_puesto,
                mail:baseDeDatos[0].empleados[1].mail  
            };
            let ciclo     = await funcionesDeTest.crearCiclo(usuario.area,"Ciclo ejemplo","Ciclo ejemplo",fechaInicio,fechaFin,1);
            
            let tarea     = await funcionesDeTest.crearTarea(usuario.id,usuario.area,ciclo.id_ciclo,"Tarea de ejemplo",1,1,"notas");
            
            let subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"sub1 tarea ejemplo",usuario.id,4,5,1,1,fechaInicio,fechaFin,"esto son notas",1);
            let preSubtarea = await funcionesDeTest.buscarSubTarea(subtarea.id_sub_tarea);
        
            let apisJSON = await fetch(`${process.env.WEB}/apis/plan-accion/deleteSubTask`,{
                method:'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_subtarea : preSubtarea.id_sub_tarea,
                    user        : usuario  
                })
            })
            
            let apis = await apisJSON.json();
            
            // Sin error de apis
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apis.error,1);
            
            if(resultadoTest.test0.estado == 'Error'){
                res.json({resultadoTest,resultadoApi:apis});
                return 1;
            };

            let posSubtarea = await funcionesDeTest.buscarSubTarea(subtarea.id_sub_tarea);
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Modificaicon de ver Sub Tarea',0,posSubtarea.ver,1);


            let apisViewJSON = await fetch(`${process.env.WEB}/apis/plan-accion/viewSubTask`,{
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idTarea     : tarea.id_tarea,
                    user        : usuario  
                })
            })
            
            let apisView = await apisViewJSON.json();
            
            let viewSubTarea = apisView.objeto.find(subtarea => subtarea.id_sub_tarea == posSubtarea.id_sub_tarea);
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'No mostrar desde api de view sub tarea',undefined,viewSubTarea,1);


            // Eliminar ejemplos
            await funcionesDeTest.eliminarSubTareas(subtarea.id_sub_tarea);

            await funcionesDeTest.eliminarTarea(tarea.id_tarea);

            await funcionesDeTest.eliminarCiclo(ciclo.id_ciclo);
            
            await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);
            
            let contadores = funcionesDeTest.contadorDeTest(resultadoTest);
            res.json({contadores,resultadoTest,resultadoApi:apis});
        }
        catch(error){
            console.log(error);
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({errorDetalleCompleto : error, error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    pruebasPreImplementacion: async (req,res) => {
        try{

            let idCiclo = 2
            let inicial = 2
            let final = 0
            let idTarea = 14
            let tareaModificada

            tareaModificada = await dataBase.tareas.update({
                    numero_de_orden: final
            },{
                where:{
                    id_tarea : idTarea
                }
            });

            if(inicial < final){
                tareaModificada = await dataBase.tareas.update({
                    numero_de_orden: Sequelize.literal('numero_de_orden - 1')
                },{
                    where:{
                        fk_ciclo : idCiclo,
                        id_tarea : {
                            [Op.ne]: idTarea
                        },
                        numero_de_orden: {
                            [Op.lte]: final 
                        }
                    }
                });
            }else{
                tareaModificada = await dataBase.tareas.update({
                    numero_de_orden: Sequelize.literal('numero_de_orden + 1')
                },{
                    where:{
                        fk_ciclo : idCiclo,
                        id_tarea : {
                            [Op.ne]: idTarea
                        },
                        numero_de_orden: {
                            [Op.gte]: final 
                        }
                    }
                });
            }
            


            let tareas = await dataBase.tareas.findAll({
                where: {
                    fk_ciclo : idCiclo
                }
            });

            console.log(tareaModificada);
            console.log(tareas);
            
            res.json({tareaModificada : tareaModificada[0] ,tareas});
        }
        catch(error){
            console.log(error);
            res.json(error);
        }
            
    }
}

module.exports = controlador;

/*

let apisJSON = await fetch(`${process.env.WEB}/apis/`,{
    method:'POST',
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        user:   usuario  
    })
})

let apis = await apisJSON.json();

// Sin error de apis
resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apis.error,1);

if(resultadoTest.test0.estado == 'Error'){
    res.json({resultadoTest,resultadoApi:apis});
    return 1;
};

*/

