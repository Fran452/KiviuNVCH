const dataBaseSQL = require("../databaseSQL/models");
const funcionesDeTest = require('./funcionesTestGenericas')

const path = require("path");

const bcrypt = require("bcrypt");
const funcionesGenericas = require("../funcionesGenerales");


const controlador = {
    
    testGenerico: async (req,res) => {
        try{
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
            let ciclo     = await funcionesDeTest.crearCiclo(usuario.area,"Ciclo ejemplo","Ciclo ejemplo",1);
            let proceso   = await funcionesDeTest.crearProceso(usuario.area,ciclo.id_ciclo,"Proceso ejemplo","Proceso ejemplo",1);
            let tarea     = await funcionesDeTest.crearTarea(usuario.id,usuario.area,proceso.id_procesos,"Tarea de ejemplo",1,1,fechaFin,"notas",5,0);
            let subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"sub tarea ejemplo",usuario.id,4,5,1,1,"esto son notas",1);

            ciclo     = await funcionesDeTest.buscarCiclo(ciclo.id_ciclo);  
            proceso   = await funcionesDeTest.buscarProceso(proceso.id_procesos);  
            tarea     = await funcionesDeTest.buscarTarea(tarea.id_tarea);
            subtarea  = await funcionesDeTest.buscarSubTarea(subtarea.id_sub_tarea);



            let retorno = {
                baseDeDatos,
                ciclo,
                proceso,
                tarea,
                subtarea,
            }


            await funcionesDeTest.eliminarSubTareas(subtarea.id_sub_tarea);
            await funcionesDeTest.eliminarTarea(tarea.id_tarea);
            await funcionesDeTest.eliminarProceso(proceso.id_procesos);
            await funcionesDeTest.eliminarCiclo(ciclo.id_ciclo);
            
            await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);

            res.json(retorno);
        }
        catch(error){
            console.log(error);
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({errorDetalleCompleto : error, error : codeError, errorDetalle: error.message});   
            return 1;
            
        }
    },
    
    crearCiclo : async (req,res) => {
        let resultadoTest = {}

        let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();

        let usuario = {
            id: baseDeDatos[0].empleados[1].id_empleado,
            nombre:baseDeDatos[0].empleados[1].nombre,
            area:baseDeDatos[0].empleados[1].fk_area,
            puesto:baseDeDatos[0].empleados[1].fk_puesto,
            mail:baseDeDatos[0].empleados[1].mail  
        };

        let apisJSON = await fetch('http://localhost:3030/apis/plan-accion/addCiclos',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre      : "Ciclo de ejemplo",
                detalles    : "Ciclo de ejemplo detalles",
                user        : usuario
            })
        })
        
        let apis = await apisJSON.json();
        
        // Sin error de apis
        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apis.error,1);
        console.log(apis.error);
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
        res.json({resultadoTest,resultadoApi:apis});
        return 0;
    },

    verCiclos: async (req,res) => {
        let resultadoTest = {}

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

        let cicloSubicos = await funcionesDeTest.crearCiclo(usuario.area,"Ciclo de ejemplo","ciclo de ejemplo detalle",1);
        let cicloSubicosNoVer = await funcionesDeTest.crearCiclo(usuario.area,"Ciclo de ejemplo No mostrar","ciclo de ejemplo detalle",0);

        let apisJSON = await fetch('http://localhost:3030/apis/plan-accion/viewCiclos',{
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
        console.log(apis.error);
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


        let apis2JSON = await fetch('http://localhost:3030/apis/plan-accion/viewCiclos',{
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
        res.json({resultadoTest,resultadoApi:{apisMismaArea:apis,apisDiferenteArea:apis2}});
        return 0;
    },

    editarCiclos: async (req,res) => {
        let resultadoTest = {}

        let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();

        let usuario = {
            id: baseDeDatos[0].empleados[1].id_empleado,
            nombre:baseDeDatos[0].empleados[1].nombre,
            area:baseDeDatos[0].empleados[1].fk_area,
            puesto:baseDeDatos[0].empleados[1].fk_puesto,
            mail:baseDeDatos[0].empleados[1].mail  
        };

        let cicloSubidosAntes = await funcionesDeTest.crearCiclo(usuario.area,"Ciclo de ejemplo","ciclo de ejemplo detalle",1);
        
        let apisJSON = await fetch('http://localhost:3030/apis/plan-accion/modCiclos',{
            method:'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({  
                nombre      : "Cambiado",   
                detalles    : "Cambiado detalle",       
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

        res.json({resultadoTest,resultadoApi:apis});
        return 0;
    },

    eliminarCiclos: async (req,res) => {
        let resultadoTest = {}

        let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();

        let usuario = {
            id: baseDeDatos[0].empleados[1].id_empleado,
            nombre:baseDeDatos[0].empleados[1].nombre,
            area:baseDeDatos[0].empleados[1].fk_area,
            puesto:baseDeDatos[0].empleados[1].fk_puesto,
            mail:baseDeDatos[0].empleados[1].mail  
        };

        let cicloSubidosAntes = await funcionesDeTest.crearCiclo(usuario.area,"Ciclo de ejemplo","ciclo de ejemplo detalle",1);

        let apisJSON = await fetch('http://localhost:3030/apis/plan-accion/deleteCiclos',{
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

        res.json({resultadoTest,resultadoApi:apis});
        return 0;
    },

    createProceso: async (req,res) => {
        try{            
            let resultadoTest = {};

            let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();

            let usuario = {
                id:     baseDeDatos[0].empleados[1].id_empleado,
                nombre: baseDeDatos[0].empleados[1].nombre,
                area:   baseDeDatos[0].empleados[1].fk_area,
                puesto: baseDeDatos[0].empleados[1].fk_puesto,
                mail:   baseDeDatos[0].empleados[1].mail  
            };

            let cicloSubidosAntes = await funcionesDeTest.crearCiclo(usuario.area,"Ciclo de ejemplo","ciclo de ejemplo detalle",1);

            console.log(cicloSubidosAntes);

            // Crear Proceso desde la api
            let apisJSON = await fetch('http://localhost:3030/apis/plan-accion/addProceso',{
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre:     "Proceso de prueba",
                    detalles:   "Detalle del Proceso de prueba",
                    ciclo:      cicloSubidosAntes.id_ciclo,
                    user:       usuario
                })
            });

            let apis = await apisJSON.json();

            // Retorno de error 
            resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apis.error,1);
            if(resultadoTest.test0.estado == 'Error'){
                res.json({resultadoTest,resultadoApi:apis});
                return 1;
            }

            // Busqueda en la base de datos 
            let proyectoSubido = await funcionesDeTest.buscarProceso(apis.objeto.id_procesos);

            resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Subida a base de datos',undefined,proyectoSubido,4);
            if(resultadoTest.test1.estado == 'Error'){
                res.json({resultadoTest,resultadoApi:apis});
                return 1;
            }

            // Nombre del proceso subido 
            resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Nombre del proceso subido','Proceso de prueba',proyectoSubido.nombre,1);

            // Descripcion del proceso subido
            resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Descripcion del proceso subido','Detalle del Proceso de prueba',proyectoSubido.detalles,1);

            // Area del proceso
            resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Area del proceso',usuario.area,proyectoSubido.fk_area,1);

            // Ciclos del proceso
            resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Ciclos del proceso',cicloSubidosAntes.id_ciclo,proyectoSubido.fk_ciclo,1);

            //! Errores 
            // Error falta de nombres
            let apisErroJSON = await fetch('http://localhost:3030/apis/plan-accion/addProceso',{
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    detalles:   "Detalle del Proceso de prueba",
                    ciclo:      cicloSubidosAntes.id_ciclo,
                    user:       usuario
                })
            });

            let apisErro = await apisErroJSON.json();
            let apisErroNombre = apisErro
            resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Codigo de error de falta de Nombre',99,apisErro.error,1);

            // Error falta de Detalle
            apisErroJSON = await fetch('http://localhost:3030/apis/plan-accion/addProceso',{
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre:     "Proceso de prueba",
                    ciclo:      cicloSubidosAntes.id_ciclo,
                    user:       usuario
                })
            });
            apisErro = await apisErroJSON.json();
            let apisErroDetalle = apisErro;
            resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Codigo de error de falta de Detalle',99,apisErro.error,1);

            // Error de falta de Ciclo
            apisErroJSON = await fetch('http://localhost:3030/apis/plan-accion/addProceso',{
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre:     "Proceso de prueba",
                    detalles:   "Detalle del Proceso de prueba",
                    user:       usuario
                })
            });
            apisErro = await apisErroJSON.json();
            let apisErroCiclo1 = apisErro;
            resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Codigo de error de falta de Ciclo',99,apisErro.error,1);




            // Eliminar ejemplo
            await funcionesDeTest.eliminarProceso(proyectoSubido.id_procesos);
            await funcionesDeTest.eliminarCiclo(cicloSubidosAntes.id_ciclo);
            await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);

            res.json({  
                    resultadoTest,
                    resultadoApi:{
                        apisCorrecta:apis,
                        apisError:{
                            sinNombre   : apisErroNombre,
                            sinDetalle  : apisErroDetalle,
                            sinCiclo    : apisErroCiclo1,
                        }
                    }
                    });
            return 0;
        }
        catch(error){
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({error : codeError, errorDetalle: error.message});   
        }
    },

    readProceso: async (req,res) => {
        let resultadoTest = {};
        
        // Crear base de datos
        let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();

        let usuarioArea1 = {
            id:     baseDeDatos[0].empleados[2].id_empleado,
            nombre: baseDeDatos[0].empleados[2].nombre,
            area:   baseDeDatos[0].empleados[2].fk_area,
            puesto: baseDeDatos[0].empleados[2].fk_Puesto,
            mail:   baseDeDatos[0].empleados[2].mail  
        };
        
        // Crear Circuito de prueba
        let cicloEjemplo1 = await funcionesDeTest.crearCiclo(usuarioArea1.area,"Ciclo de ejemplo","ciclo de ejemplo detalle",1);
        let cicloEjemplo2 = await funcionesDeTest.crearCiclo(usuarioArea1.area,"Ciclo de ejemplo","ciclo de ejemplo detalle",1);

        // Crear proyecto de prueba
        let procesoTest = await funcionesDeTest.crearProceso(usuarioArea1.area,cicloEjemplo1.id_ciclo,"test de prueba","test de prueba",1);
        let procesoTest2 = await funcionesDeTest.crearProceso(usuarioArea1.area,cicloEjemplo2.id_ciclo,"test de prueba","test de prueba",1);

        // Buscar muestra de proyecto con usuario con area en el proyecto
        let apisJSON = await fetch('http://localhost:3030/apis/plan-accion/viewProceso',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ciclo:  cicloEjemplo1.id_ciclo,
                user:   usuarioArea1
            })
        })
        
        let apis = await apisJSON.json();
        
        // Sin error de apis
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apis.error,1);
        if(resultadoTest.test0.estado == 'Error'){
            res.json({resultadoTest,resultadoApi:apis});
            return 1;
        }
        
        // Buscar proyecto subido
        let proceso = apis.objeto.find(proceso => proceso.id_procesos == procesoTest.id_procesos);
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Encontrar proyecto creado',undefined,proceso,4);

        //Buscar si esta el proyecto de otro ciclo
        proceso = apis.objeto.find(proceso => proceso.id_procesos == procesoTest2.id_procesos);
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'No encontrar proyecto creado de otro ciclo',undefined,proceso,1);


        // Eliminar ejemplo
        await funcionesDeTest.eliminarProceso(procesoTest.id_procesos);
        await funcionesDeTest.eliminarProceso(procesoTest2.id_procesos);
        await funcionesDeTest.eliminarCiclo(cicloEjemplo1.id_ciclo);
        await funcionesDeTest.eliminarCiclo(cicloEjemplo2.id_ciclo);
        await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);
        res.json({resultadoTest,resultadoApi: apis});
    },

    editeProceso: async (req,res) => {
        let resultadoTest = {};

        // Crear base de datos
        let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();

        let usuarioArea1 = {
            id:     baseDeDatos[0].empleados[2].id_empleado,
            nombre: baseDeDatos[0].empleados[2].nombre,
            area:   baseDeDatos[0].empleados[2].fk_area,
            puesto: baseDeDatos[0].empleados[2].fk_Puesto,
            mail:   baseDeDatos[0].empleados[2].mail  
        };
        console.log(baseDeDatos);
        // Crear proyecto de prueba
        let cicloEjemplo1 = await funcionesDeTest.crearCiclo(usuarioArea1.area,"Ciclo de ejemplo","ciclo de ejemplo detalle",1);
        let crearProceso = await funcionesDeTest.crearProceso(usuarioArea1.area,cicloEjemplo1.id_ciclo,"test de prueba","test de prueba",1);
        let procesoAntiguo = await funcionesDeTest.buscarProceso(crearProceso.id_procesos);


        // Edicion de proyecto para usuario miembro del area
        let apisJSON = await fetch('http://localhost:3030/apis/plan-accion/modProceso',{
            method:'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre:"test de prueba modificado",
                detalles: 'test de prueba descripcion modifcado',
                idProceso: procesoAntiguo.id_procesos,
                user: usuarioArea1
            })
        });
        
        let apis = await apisJSON.json();

        // Sin error de apis
        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apis.error,1);
        
        if(resultadoTest.test0.estado == 'Error'){
            res.json({resultadoTest,resultadoApi:apis});
            return 1;
        }

        let proyectoEditado = await funcionesDeTest.buscarProceso(procesoAntiguo.id_procesos);

        // Diferencia entre nombre antiguo y actual
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Diferencia entre nombre antiguo y actual',procesoAntiguo.nombre,proyectoEditado.nombre,4);

        // Editado nombre
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Editado nombre','test de prueba modificado',proyectoEditado.nombre,1);
        
        // Diferencia entre detalle antiguo y detalle actual
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Diferencia entre nombre antiguo y actual',procesoAntiguo.detalles,proyectoEditado.detalles,4);

        // Editado descipcion
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Detalles editada','test de prueba descripcion modifcado',proyectoEditado.detalles,1);
        
    
        // Eliminar ejemplo
        await funcionesDeTest.eliminarProceso(procesoAntiguo.id_procesos);
        await funcionesDeTest.eliminarCiclo(cicloEjemplo1.id_ciclo);
        await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);

        res.json({resultadoTest,resultadoApi:apis});
    },

    deleteProceso: async (req,res) => {
        let resultadoTest = {}

        // Crear base de datos
        let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();

        let usuarioArea1 = {
            id:     baseDeDatos[0].empleados[2].id_empleado,
            nombre: baseDeDatos[0].empleados[2].nombre,
            area:   baseDeDatos[0].empleados[2].fk_area,
            puesto: baseDeDatos[0].empleados[2].fk_Puesto,
            mail:   baseDeDatos[0].empleados[2].mail  
        };


        // Crear proyecto de prueba
        let cicloEjemplo1 = await funcionesDeTest.crearCiclo(usuarioArea1.area,"Ciclo de ejemplo","ciclo de ejemplo detalle",1);

        let crearProceso = await funcionesDeTest.crearProceso(usuarioArea1.area,cicloEjemplo1.id_ciclo,"test de prueba","test de prueba",1);

        // Edicion de proyecto
        let apisJSON = await fetch('http://localhost:3030/apis/plan-accion/deleteProceso',{
            method:'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idProceso: crearProceso.id_procesos,
                user: usuarioArea1
            })
        });
        
        let apis = await apisJSON.json();

        // Sin error de apis
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apis.error,1);
        
        if(resultadoTest.test0.estado == 'Error'){
            res.json({resultadoTest,resultadoApi:apis});
            return 1;
        }

        let procesoEliminado = await funcionesDeTest.buscarProceso(crearProceso.id_procesos);

        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'opcion ver en 0',0,procesoEliminado.ver,1);

        let apisVerJSON = await fetch('http://localhost:3030/apis/plan-accion/viewProceso',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ciclo: cicloEjemplo1.id_ciclo,
                user:   usuarioArea1
            })
        });

        let apisVer = await apisVerJSON.json();

        let proyectoElimiandoVer = apisVer.objeto.find(proceso => proceso.id_procesos == procesoEliminado.id_procesos);

        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'No aparece entrando desde api',undefined,proyectoElimiandoVer,1);

        // eliminar basuda
        await funcionesDeTest.eliminarProceso(procesoEliminado.id_procesos);

        await funcionesDeTest.eliminarCiclo(cicloEjemplo1.id_ciclo);

        await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);
        res.json({resultadoTest,resultadoApi:apis});
        
    },

    createTarea: async (req,res) => {
        try{
            let resultadoTest = {}

            // Base de datos
            let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();
            
            let ahora = new Date();
            let fechaDeInicio = ahora.toISOString().split('T')[0];
            ahora.setDate(ahora.getDate() + 7);
            let fechaDelFinal = ahora.toISOString().split('T')[0];
            let areaDeApoyo = baseDeDatos[1].area.id_area;
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
            let crearCiclo     = await funcionesDeTest.crearCiclo(usuario.area,'ciclo prueba','ciclo de prueba',1);
            let crearProceso   = await funcionesDeTest.crearProceso(usuario.area,crearCiclo.id_ciclo,"test de prueba","test de prueba",1);
            let proceso        = await funcionesDeTest.buscarProceso(crearProceso.id_procesos);


            // Inicio del test
            let apisJSON = await fetch('http://localhost:3030/apis/plan-accion/addTask',{
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    empleado_asignado   : usuario.mail,
                    areaApoyo           : areaDeApoyo,    
                    idProceso           : crearProceso.id_procesos,
                    nombre              : 'Tarea de prueba',
                    estado              : 1,
                    prioridad           : 1,    
                    fechaInicio         : fechaDeInicio,
                    fechaFinal          : fechaDelFinal,
                    notas               : 'Tarea de prueba para hacer los test',
                    progreso            : 0,  
                    horas_Necesarias    : 5,  
                    user                : usuario
                })
            });
            
            let apis = await apisJSON.json();
            
            // Sin error de apis
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apis.error,1);
            if(resultadoTest.test0.estado == 'Error'){
                console.log("entre al if");
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
            let apisErrorJSON = await fetch('http://localhost:3030/apis/plan-accion/addTask',{
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    empleado_asignado   : 'noExiste@gmail.com',
                    fechaInicio         : fechaDeInicio,
                    fechaFinal          : fechaDelFinal,
                    nombre              : 'Tarea de prueba',
                    estado              : 1,
                    prioridad           : 1,    
                    notas               : 'Tarea de prueba para hacer los test',
                    areaApoyo           : areaDeApoyo,    
                    progreso            : 0,    
                    idProceso           : crearProceso.id_procesos,     
                    horas_Necesarias    : 5,  
                    user                : usuario
                })
            });

            let apisError = await apisErrorJSON.json();

    
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Error de inexistencia de mail',10,apisError.error,1);

            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Error de inexistencia de mail detalle','El correo del responsable no existe.',apisError.errorDetalle,1);
            
            // Error de fechas mal subidas
            ahora.setDate(ahora.getDate() - 15);

            let fechaDeFinalError = ahora.toISOString().split('T')[0];

            let apisError2JSON = await fetch('http://localhost:3030/apis/plan-accion/addTask',{
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    empleado_asignado   : usuario.mail,
                    fechaInicio         : fechaDeInicio,
                    fechaFinal          : fechaDeFinalError,
                    nombre              : 'Tarea de prueba',
                    estado              : 1,
                    prioridad           : 1,    
                    notas               : 'Tarea de prueba para hacer los test',
                    areaApoyo           : areaDeApoyo,    
                    progreso            : 0,    
                    idProceso           : crearProceso.id_procesos,
                    horas_Necesarias    : 5,       
                    user                : usuario
                })
            });

            let apisError2 = await apisError2JSON.json();
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Error de inexistencia de fecha mal',99,apisError2.error,1);

            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Error de inexistencia de fecha mal','fecha_inicio is greater than the current',apisError2.errorDetalle,1);
            
            // Error de usuario no existente
            let apisError3JSON = await fetch('http://localhost:3030/apis/plan-accion/addTask',{
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    empleado_asignado:  usuario2.mail,
                    fechaInicio:        fechaDeInicio,
                    fechaFinal:         fechaDelFinal,
                    nombre:             'Tarea de prueba',
                    estado:             1,
                    prioridad:          1,    
                    notas:              'Tarea de prueba para hacer los test',
                    areaApoyo:          areaDeApoyo,    
                    progreso:           0,    
                    idProyecto:         proceso.id_procesos,   
                    horas_Necesarias    : 5,    
                    user:               usuario
                })
            });

            let apisError3 = await apisError3JSON.json();
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Error de inexistencia de mail',99,apisError3.error,1);

            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Error de usuario de otra area','Usuario indicado no perteneciente al area',apisError3.errorDetalle,1);
            

            // eliminar ejemplo
            await funcionesDeTest.eliminarTarea(tareaEjemplo.id_tarea);
            await funcionesDeTest.eliminarProceso(crearProceso.id_procesos);
            await funcionesDeTest.eliminarCiclo(crearCiclo.id_ciclo);
            await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);

            res.json({resultadoTest,resultadoApi:apis});

        }
        catch(error){
            console.log(error);
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({errorDetalleCompleto : error, error : codeError, errorDetalle: error.message});   
            return 1;
        }

    },

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
            let creaCiclo  = await funcionesDeTest.crearCiclo(usuario.area,"ciclo test","ciclo test prueba",1)
            let crearProceso = await funcionesDeTest.crearProceso(area,creaCiclo.id_ciclo,"test de prueba","test de prueba",1);
            let proyecto = await funcionesDeTest.buscarProceso(crearProceso.id_procesos)
            // tareas de ejemplo
            let tarea1 = await funcionesDeTest.crearTarea(usuario.id,area,areaApoyo, `proyecto de prueba n1`,proyecto.id_procesos,1,1,fechaInicio,fechaFin,'texto de pruebas para tareas',50);
            let tarea2 = await funcionesDeTest.crearTarea(usuario.id,area,areaApoyo, `proyecto de prueba n2`,proyecto.id_procesos,1,1,fechaInicio,fechaFin,'texto de pruebas para tareas',25);
            let tarea3 = await funcionesDeTest.crearTarea(usuario.id,area,areaApoyo, `proyecto de prueba n3`,proyecto.id_procesos,1,1,fechaInicio,fechaFin,'texto de pruebas para tareas',75);

            let apisJSON = await fetch('http://localhost:3030/apis/plan-accion/viewTask',{
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idProceso: proyecto.id_procesos,
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

            // Mostrar primer elemento
            let tarea1BD = apis.objeto.find(tarea => tarea.id_tarea == tarea1.id_tarea);
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Mostrar primer elemento',undefined,tarea1BD,4);
            
            // Mostrar segundo elemento
            let tarea2BD = apis.objeto.find(tarea => tarea.id_tarea == tarea2.id_tarea);
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Mostrar segundo elemento',undefined,tarea2BD,4);

            // Mostrar tercer elemento
            let tarea3BD = apis.objeto.find(tarea => tarea.id_tarea == tarea3.id_tarea);
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Mostrar tercero elemento',undefined,tarea3BD,4);

            // Eliminar ejemplos
            await funcionesDeTest.eliminarTarea(tarea1BD.id_tarea);
            await funcionesDeTest.eliminarTarea(tarea2BD.id_tarea);
            await funcionesDeTest.eliminarTarea(tarea3BD.id_tarea);
            await funcionesDeTest.eliminarProceso(proyecto.id_procesos);
            await funcionesDeTest.eliminarCiclo(creaCiclo.id_ciclo);
            await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);

            res.json({resultadoTest,resultadoApi:apis});
        }
        catch(error){
            console.log(error);
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({errorDetalleCompleto : error, error : codeError, errorDetalle: error.message});   
            return 1;
        }

    },

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
            let crearCiclo = await funcionesDeTest.crearCiclo(area,"ciclo de test","ciclo de test Detalle",1)
            let crearProceso = await funcionesDeTest.crearProceso(area,crearCiclo.id_ciclo,"test de prueba","test de prueba",1);
            let proyecto = await funcionesDeTest.buscarProceso(crearProceso.id_procesos);

            // tareas de ejemplo
            let tareaCreada = await funcionesDeTest.crearTarea(usuario.id,area,areaApoyo, `tarea de prueba`,proyecto.id_procesos,1,1,fechaInicio,fechaFin,'texto de pruebas para tareas',50);
            let tareaAntes = await funcionesDeTest.buscarTarea(tareaCreada.id_tarea);
            
            let apisJSON = await fetch('http://localhost:3030/apis/plan-accion/modTask',{
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
                    fechaInicio       : fechaInicio,     
                    fechaFinal        : fechaFin,     
                    notas             : 'cambiando la nota', 
                    areaApoyo         : areaApoyo,     
                    progreso          : 40,     
                    idProyecto        : proyecto.id_procesos,     
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
            

            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Cambio de la tarea de forma correcta','tarea de prueba',tareaDespues.nombre,1);

            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Diferencia con la tarea origianl',0,apis.error,1);
            
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'texto de pruebas para tareas',0,apis.error,1);

            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Diferencia entre texto antes y despues de edicion',0,apis.error,1);

            
            // Eliminar ejemplos
            await funcionesDeTest.eliminarTarea(tareaAntes.id_tarea);
            await funcionesDeTest.eliminarProceso(proyecto.id_procesos);
            await funcionesDeTest.eliminarCiclo(crearCiclo.id_ciclo);
            await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);    

            res.json({resultadoTest,resultadoApi:apis});
        }
        catch(error){
            console.log(error);
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({errorDetalleCompleto : error, error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    deleteTarea: async (req,res) => {
        let resultadoTest = {}



        res.json({resultadoTest,resultadoApi:apis});
    },
    

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
            let usuario2 = {
                id:     baseDeDatos[1].empleados[2].id_empleado,
                nombre: baseDeDatos[1].empleados[2].nombre,
                area:   baseDeDatos[1].empleados[2].fk_area,
                puesto: baseDeDatos[1].empleados[2].fk_Puesto,
                mail:   baseDeDatos[1].empleados[2].mail  
            };

            // fecha usada
            let ahora = new Date();
            let fechaInicio = ahora.toISOString().split('T')[0];
            ahora.setDate(ahora.getDate() + 7);
            let fechaFin = ahora.toISOString().split('T')[0];

            let crearCiclo = await funcionesDeTest.crearCiclo(usuario.area,"ciclo de test","ciclo de test Detalle",1)
            let crearProceso = await funcionesDeTest.crearProceso(usuario.area,crearCiclo.id_ciclo,"test de prueba","test de prueba",1);
            let tareaCreadaAntigua = await funcionesDeTest.crearTarea(usuario.id,usuario.area,usuario2.area, `tarea de prueba`,crearProceso.id_procesos,1,1,fechaInicio,fechaFin,'texto de pruebas para tareas',50);
            console.log("entre a la api");
            let apisJSON = await fetch('http://localhost:3030/apis/plan-accion/addSubTask',{
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_tareas       : tareaCreadaAntigua.id_tarea,          
                    titulo          : "Sub tarea de ejemplo",      
                    asignacion      : usuario.mail,          
                    horasAprox      : 4,          
                    avece           : 0,      
                    estado          : 0,      
                    prioridad       : 0,          
                    notas           : "Nota ",      
                    user            : usuario  
                })
            })
            
            let apis = await apisJSON.json();
            
            // Sin error de apis
            resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apis.error,1);
        

            if(resultadoTest.test0.estado == 'Error'){
                res.json({resultadoTest,resultadoApi:apis});
                return 1;
            };
            





            // Eliminar ejemplos
            await funcionesDeTest.eliminarTarea(tareaAntes.id_tarea);
            await funcionesDeTest.eliminarProceso(proyecto.id_procesos);
            await funcionesDeTest.eliminarCiclo(crearCiclo.id_ciclo);
            await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);    

            res.json({resultadoTest,resultadoApi:apis});
        }
        catch(error){
            console.log(error);
            let codeError = funcionesGenericas.armadoCodigoDeError(error.name);
            res.json({errorDetalleCompleto : error, error : codeError, errorDetalle: error.message});   
            return 1;
        }
    },

    editSubTarea: async (req,res) => {
        try{

        }
        catch(error){

        }
    },

    viewSubTarea: async (req,res) => {
        try{

        }
        catch(error){

        }
    },

    deleteSubTarea: async (req,res) => {
        try{

        }
        catch(error){

        }
    },
}

module.exports = controlador;

/*

let apisJSON = await fetch('http://localhost:3030/apis/',{
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
console.log(apis.error);
if(resultadoTest.test0.estado == 'Error'){
    res.json({resultadoTest,resultadoApi:apis});
    return 1;
};

*/

