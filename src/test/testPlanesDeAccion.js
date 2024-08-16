const dataBaseSQL = require("../databaseSQL/models");
const funcionesDeTest = require('./funcionesTestGenericas')

const path = require("path");

const bcrypt = require("bcrypt");
const funcionesGenericas = require("../funcionesGenerales");


const controlador = {
    
    testGenerico: async (req,res) => {
        let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();

        await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);
        res.json(baseDeDatos);
    },
  
    createProyecto: async (req,res) => {
        let resultadoTest = {}

        let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();

        let usuario = {
            id: baseDeDatos[0].empleados[1].id_empleado,
            nombre:baseDeDatos[0].empleados[1].nombre,
            area:baseDeDatos[0].empleados[1].fk_area,
            puesto:baseDeDatos[0].empleados[1].fk_puesto,
            mail:baseDeDatos[0].empleados[1].mail  
        };

        // Crear proyecto desde la api
        let apisJSON = await fetch('http://localhost:3030/apis/plan-accion/addProyect',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: "Proyecto de prueba",
                detalles: "Detalle del proyecto de prueba",
                user: usuario
            })
        });

        let apis = await apisJSON.json();

        // Retorno de error 
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apis.error,1);
        if(resultadoTest.test0.estado == 'Error'){
            res.json({resultadoTest,resultadoApi:metricaEditada});
            return 1;
        }

        // Busqueda en la base de datos 
        let proyectoSubido = await funcionesDeTest.buscarProyecto(apis.objeto.id_proyecto);
        console.log(proyectoSubido);
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Subida a base de datos',undefined,proyectoSubido,4);
        if(resultadoTest.test1.estado == 'Error'){
            res.json({resultadoTest,resultadoApi:metricaEditada});
            return 1;
        }

        // Nombre del proyecto subido 
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Nombre del proyecto subido','Proyecto de prueba',proyectoSubido.nombre,1);

        // Descripcion del proyecto subido
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Descripcion del proyecto subido','Detalle del proyecto de prueba',proyectoSubido.detalles,1);

        // Area del proyecto
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Area del proyecto',usuario.area,proyectoSubido.fk_area,1);

        // Eliminar ejemplo
        await funcionesDeTest.eliminarProyecto(proyectoSubido.id_proyecto);

        await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);

        res.json({resultadoTest,resultadoApi:apis});
        return 0;

    },

    readProyecto: async (req,res) => {
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

        let usuarioArea2 = {
            id:     baseDeDatos[1].empleados[2].id_empleado,
            nombre: baseDeDatos[1].empleados[2].nombre,
            area:   baseDeDatos[1].empleados[2].fk_area,
            puesto: baseDeDatos[1].empleados[2].fk_Puesto,
            mail:   baseDeDatos[1].empleados[2].mail  
        };

        let jefeArea = {
            id:     baseDeDatos[1].empleados[1].id_empleado,
            nombre: baseDeDatos[1].empleados[1].nombre,
            area:   baseDeDatos[1].empleados[1].fk_area,
            puesto: baseDeDatos[1].empleados[1].fk_Puesto,
            mail:   baseDeDatos[1].empleados[1].mail  
        };

        console.log(usuarioArea1);
        // Crear proyecto de prueba
        let proyectoTest = await funcionesDeTest.crearProyecto(usuarioArea1.area,"test de prueba","test de prueba");

        // Buscar muestra de proyecto con usuario con area en el proyecto
        let apisJSON = await fetch('http://localhost:3030/apis/plan-accion/viewProyect',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user:usuarioArea1
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
        let proyecto = apis.objeto.find(proyecto => proyecto.id_proyecto == proyectoTest.id_proyecto)
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Encontrar proyecto creado',undefined,proyecto,4);

        // Buscar muestra de proyecto con usuario sin area en el proyecto
        let apisCaso2JSON = await fetch('http://localhost:3030/apis/plan-accion/viewProyect',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
           body: JSON.stringify({
            user: usuarioArea2
            })
        });


        let apisCaso2 = await apisCaso2JSON.json();

        // Sin error de apis
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis caso 2',0,apisCaso2.error,1);
        if(resultadoTest.test0.estado == 'Error'){
            res.json({resultadoTest,resultadoApi:apis});
            return 1;
        }

        // Buscar proyecto subido
        let proyecto2 = apisCaso2.objeto.find(proyecto => proyecto.id_proyecto == proyectoTest.id_proyecto);
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Encontrar proyecto creado para usuario de otra area',undefined,proyecto2,1);

        // Buscar muestra de proyecto con usuario sin area en el proyecto
        let apisCaso3JSON = await fetch('http://localhost:3030/apis/plan-accion/viewProyect',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
           body: JSON.stringify({
            user: jefeArea
            })
        });
        
        let apisCaso3 = await apisCaso3JSON.json();

        // Sin error de apis
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis caso 2',0,apisCaso2.error,1);
        if(resultadoTest.test0.estado == 'Error'){
            res.json({resultadoTest,resultadoApi:apis});
            return 1;
        };

        // Buscar proyecto subido
        proyecto = apisCaso3.objeto.find(proyecto => proyecto.id_proyecto == proyectoTest.id_proyecto)
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Encontrar proyecto creado vista jefe',undefined,proyecto,4);
        
        

        // Eliminar ejemplo
        await funcionesDeTest.eliminarProyecto(proyectoTest.id_proyecto);
        await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);


        res.json({resultadoTest,resultadoApi:{
            apisCaso1: apis,
            apisCaso2: apisCaso2,
            apisCaso3 : apisCaso3
        }});
    },

    editeProyecto: async (req,res) => {
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

        let usuarioArea2 = {
            id:     baseDeDatos[1].empleados[2].id_empleado,
            nombre: baseDeDatos[1].empleados[2].nombre,
            area:   baseDeDatos[1].empleados[2].fk_area,
            puesto: baseDeDatos[1].empleados[2].fk_Puesto,
            mail:   baseDeDatos[1].empleados[2].mail  
        };

        let jefeArea = {
            id:     baseDeDatos[1].empleados[1].id_empleado,
            nombre: baseDeDatos[1].empleados[1].nombre,
            area:   baseDeDatos[1].empleados[1].fk_area,
            puesto: baseDeDatos[1].empleados[1].fk_Puesto,
            mail:   baseDeDatos[1].empleados[1].mail  
        };

        // Crear proyecto de prueba
        let crearProyecto = await funcionesDeTest.crearProyecto(baseDeDatos[0].id_area,"test de prueba","test de prueba");
        let proyectoAntiguo = await funcionesDeTest.buscarProyecto(crearProyecto.id_proyecto);


        // Edicion de proyecto para usuario miembro del area
        let apisJSON = await fetch('http://localhost:3030/apis/plan-accion/modProyect',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre:"test de prueba modificado",
                detalles: 'test de prueba descripcion modifcado',
                idProyecto: proyectoAntiguo.id_proyecto,
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

        let proyectoEditado = await funcionesDeTest.buscarProyecto(proyectoAntiguo.id_proyecto);

        // Diferencia entre nombre antiguo y actual
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Diferencia entre nombre antiguo y actual',proyectoAntiguo.nombre,proyectoEditado.nombre,4);

        // Editado nombre
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Editado nombre','test de prueba modificado',proyectoEditado.nombre,1);
        
        // Diferencia entre detalle antiguo y detalle actual
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Diferencia entre nombre antiguo y actual',proyectoAntiguo.detalles,proyectoEditado.detalles,4);

        // Editado descipcion
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Detalles editada','test de prueba descripcion modifcado',proyectoEditado.detalles,1);
        
        

        crearProyecto = await funcionesDeTest.crearProyecto(baseDeDatos[0].id_area,"test de prueba","test de prueba");
        proyectoAntiguo = await funcionesDeTest.buscarProyecto(crearProyecto.id_proyecto);

        let apis2JSON = await fetch('http://localhost:3030/apis/plan-accion/modProyect',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre:"test de prueba modificado",
                detalles: 'test de prueba descripcion modifcado',
                idProyecto: proyectoAntiguo.id_proyecto,
                user: usuarioArea2
            })
        });
        
        let apis2 = await apis2JSON.json();

        // codigo de error sin permisos
        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Error de permisos',99,apis2.error,1);

        // detalle del error correcto
        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Error de permisos detalle','Sin permisos para modificar proyectos de otras areas1',apis.errorDetalle,1);
        
        let proyectoSinEditar = await funcionesDeTest.buscarProyecto(proyectoAntiguo.id_proyecto);

        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Sin modificacion del proyecto subido','test de prueba',proyectoSinEditar.nombre,1);


        crearProyecto = await funcionesDeTest.crearProyecto(baseDeDatos[0].id_area,"test de prueba","test de prueba");
        proyectoAntiguo = await funcionesDeTest.buscarProyecto(crearProyecto.id_proyecto);

        let apis3JSON = await fetch('http://localhost:3030/apis/plan-accion/modProyect',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre:"test de prueba modificado",
                detalles: 'test de prueba descripcion modifcado',
                idProyecto: proyectoAntiguo.id_proyecto,
                user: jefeArea
            })
        });

        let apis3 = await apis3JSON.json();

        // Sin error de apis
        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apis3.error,1);

        proyectoEditado = await funcionesDeTest.buscarProyecto(proyectoAntiguo.id_proyecto);

        // Diferencia entre nombre antiguo y actual
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Diferencia entre nombre antiguo y actual',proyectoAntiguo.nombre,proyectoEditado.nombre,4);

        // Editado nombre
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Editado nombre','test de prueba modificado',proyectoEditado.nombre,1);

        // Eliminar ejemplo
        await funcionesDeTest.eliminarProyecto(proyectoAntiguo.id_proyecto);
        await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);

        res.json({resultadoTest,resultadoApi:{apis,apis2,apis3}});
    },

    deleteProyecto: async (req,res) => {
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

        let usuarioArea2 = {
            id:     baseDeDatos[1].empleados[2].id_empleado,
            nombre: baseDeDatos[1].empleados[2].nombre,
            area:   baseDeDatos[1].empleados[2].fk_area,
            puesto: baseDeDatos[1].empleados[2].fk_Puesto,
            mail:   baseDeDatos[1].empleados[2].mail  
        };

        let jefeArea = {
            id:     baseDeDatos[1].empleados[1].id_empleado,
            nombre: baseDeDatos[1].empleados[1].nombre,
            area:   baseDeDatos[1].empleados[1].fk_area,
            puesto: baseDeDatos[1].empleados[1].fk_Puesto,
            mail:   baseDeDatos[1].empleados[1].mail  
        };

        // Crear proyecto de prueba
        let crearProyecto = await funcionesDeTest.crearProyecto(baseDeDatos[0].id_area,"test de prueba","test de prueba");

        // Edicion de proyecto
        let apisJSON = await fetch('http://localhost:3030/apis/plan-accion/deleteProyect',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idProyecto: crearProyecto.id_proyecto,
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

        let proyectoEliminado = await funcionesDeTest.buscarProyecto(crearProyecto.id_proyecto);

        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'opcion ver en 0',0,proyectoEliminado.ver,1);

        let apisVerJSON = await fetch('http://localhost:3030/apis/plan-accion/viewProyect',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user:usuarioArea1
            })
        });

        let apisVer = await apisVerJSON.json();

        let proyectoElimiandoVer = apisVer.objeto.find(proyecto => proyecto.id_proyecto == proyectoEliminado.id_proyecto);

        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'No aparece entrando desde api',undefined,proyectoElimiandoVer,1);


        await funcionesDeTest.eliminarProyecto(proyectoEliminado.id_proyecto);
        await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);
        res.json({resultadoTest,resultadoApi:apis});
        
    },

    createTarea: async (req,res) => {
        let resultadoTest = {}

        // Base de datos
        let baseDeDatoTest = await funcionesDeTest.crarAmbienteGenerico();
        
        // Crear proyecto de prueba
        let crearProyecto = await funcionesDeTest.crearProyecto(baseDeDatoTest.empleados[0].fk_area,"test de prueba","test de prueba");
        let proyecto = await funcionesDeTest.buscarProyecto(crearProyecto.id_proyecto);
        
        let ahora = new Date();
        let fechaDeInicio = ahora.toISOString().split('T')[0];
        ahora.setDate(ahora.getDate() + 7);
        let fechaDelFinal = ahora.toISOString().split('T')[0];
        let areaDeApoyo = baseDeDatoTest.areas[1].id_area;
        let usuario = {
            id:     baseDeDatoTest.empleados[0].id_empleado,
            nombre: baseDeDatoTest.empleados[0].nombre,
            area:   baseDeDatoTest.empleados[0].fk_area,
            puesto: baseDeDatoTest.empleados[0].fk_puesto,
            mail:   baseDeDatoTest.empleados[0].mail
        };

        let usuario2 = {
            id:     baseDeDatoTest.empleados[4].id_empleado,
            nombre: baseDeDatoTest.empleados[4].nombre,
            area:   baseDeDatoTest.empleados[4].fk_area,
            puesto: baseDeDatoTest.empleados[4].fk_puesto,
            mail:   baseDeDatoTest.empleados[4].mail
        };

        let apisJSON = await fetch('http://localhost:3030/apis/plan-accion/addTask',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                empleado_asignado:  usuario.mail,
                fechaInicio:        fechaDeInicio,
                fechaFinal:         fechaDelFinal,
                nombre:             'Tarea de prueba',
                estado:             1,
                prioridad:          1,    
                notas:              'Tarea de prueba para hacer los test',
                areaApoyo:          areaDeApoyo,    
                progreso:           0,    
                idProyecto:         proyecto.id_proyecto,     
                user:               usuario
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
                empleado_asignado:  'noExiste@gmail.com',
                fechaInicio:        fechaDeInicio,
                fechaFinal:         fechaDelFinal,
                nombre:             'Tarea de prueba',
                estado:             1,
                prioridad:          1,    
                notas:              'Tarea de prueba para hacer los test',
                areaApoyo:          areaDeApoyo,    
                progreso:           0,    
                idProyecto:         proyecto.id_proyecto,     
                user:               usuario
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
                empleado_asignado:  usuario.mail,
                fechaInicio:        fechaDeInicio,
                fechaFinal:         fechaDeFinalError,
                nombre:             'Tarea de prueba',
                estado:             1,
                prioridad:          1,    
                notas:              'Tarea de prueba para hacer los test',
                areaApoyo:          areaDeApoyo,    
                progreso:           0,    
                idProyecto:         proyecto.id_proyecto,     
                user:               usuario
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
                idProyecto:         proyecto.id_proyecto,     
                user:               usuario
            })
        });

        let apisError3 = await apisError3JSON.json();
        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Error de inexistencia de mail',99,apisError3.error,1);

        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Error de usuario de otra area','Usuario indicado no perteneciente al area',apisError3.errorDetalle,1);
        

        // eliminar ejemplo
        await funcionesDeTest.eliminarTarea(tareaEjemplo.id_tarea);    
        await funcionesDeTest.eliminarProyecto(crearProyecto.id_proyecto);
        await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatoTest);

        res.json({resultadoTest,resultadoApi:apis});

    },

    readTarea: async (req,res) => {
        let resultadoTest = {}

        // Armado de ambiente test
        let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();
    
        // Areas Usadas 
        let area        = baseDeDatos.areas[0].id_area
        let areaApoyo   = baseDeDatos.areas[1].id_area
        
        // fecha usada
        let ahora = new Date();
        let fechaInicio = ahora.toISOString().split('T')[0];
        ahora.setDate(ahora.getDate() + 7);
        let fechaFin = ahora.toISOString().split('T')[0];

        // proyecto para las tareas 
        let crearProyecto = await funcionesDeTest.crearProyecto(area,"test de prueba","test de prueba");
        let proyecto = await funcionesDeTest.buscarProyecto(crearProyecto.id_proyecto);

        // tareas de ejemplo
        let tarea1 = await funcionesDeTest.crearTarea(baseDeDatos.empleados[0].id_empleado,area,areaApoyo, `proyecto de prueba n1`,proyecto.id_proyecto,1,1,fechaInicio,fechaFin,'texto de pruebas para tareas',50);
        let tarea2 = await funcionesDeTest.crearTarea(baseDeDatos.empleados[0].id_empleado,area,areaApoyo, `proyecto de prueba n2`,proyecto.id_proyecto,1,1,fechaInicio,fechaFin,'texto de pruebas para tareas',25);
        let tarea3 = await funcionesDeTest.crearTarea(baseDeDatos.empleados[0].id_empleado,area,areaApoyo, `proyecto de prueba n3`,proyecto.id_proyecto,1,1,fechaInicio,fechaFin,'texto de pruebas para tareas',75);

        let apisJSON = await fetch('http://localhost:3030/apis/plan-accion/viewTask',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idProyecto: proyecto.id_proyecto,
                user:       {
                                id:         baseDeDatos.empleados[0].id_empleado,
                                nombre:     baseDeDatos.empleados[0].nombre,
                                area:       baseDeDatos.empleados[0].fk_area,
                                puesto:     baseDeDatos.empleados[0].fk_puesto,
                                mail:       baseDeDatos.empleados[0].mail
                            }
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
        await funcionesDeTest.eliminarProyecto(proyecto.id_proyecto);
        await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);

        res.json({resultadoTest,resultadoApi:apis});
    },

    editeTarea: async (req,res) => {
        let resultadoTest = {}

        // Armado de ambiente test
        let baseDeDatos = await funcionesDeTest.crarAmbienteGenerico();
    
        // Areas Usadas 
        let area        = baseDeDatos.areas[0].id_area;
        let areaApoyo   = baseDeDatos.areas[1].id_area;
        let empleado1   = baseDeDatos.usuario[0];
        let empleado2   = baseDeDatos.usuario[0];
        
        // fecha usada
        let ahora = new Date();
        let fechaInicio = ahora.toISOString().split('T')[0];
        ahora.setDate(ahora.getDate() + 7);
        let fechaFin = ahora.toISOString().split('T')[0];

        // proyecto para las tareas 
        let crearProyecto = await funcionesDeTest.crearProyecto(area,"test de prueba","test de prueba");
        let proyecto = await funcionesDeTest.buscarProyecto(crearProyecto.id_proyecto);

        // tareas de ejemplo
        let tareaAntes = await funcionesDeTest.crearTarea(baseDeDatos.empleados[0].id_empleado,area,areaApoyo, `tarea de prueba`,proyecto.id_proyecto,1,1,fechaInicio,fechaFin,'texto de pruebas para tareas',50);
        
        let apisJSON = await fetch('http://localhost:3030/apis/',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tarea             :  tareaAntes,
                empleado_asignado : empleado1.id_empleado,             
                nombre            : 'tarea de prueba editado', 
                estado            : 0, 
                prioridad         : 0,     
                fechaInicio       : fechaInicio,     
                fechaFinal        : fechaFin,     
                notas             : 'cambiando la nota', 
                areaApoyo         : areaApoyo,     
                progreso          : 40,     
                idProyecto        : proyecto.id_proyecto,     
                user              : {
                                        id:     empleado1.id_empleado,
                                        nombre: empleado1.nombre,
                                        area:   empleado1.fk_area,
                                        puesto: empleado1.fk_puesto,
                                        mail:   empleado1.mail
                                    }
            })
        })
        
        let apis = await apisJSON.json();
        // Sin error de apis
        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apis.error,1);

        if(resultadoTest.test0.estado == 'Error'){
            res.json({resultadoTest,resultadoApi:apis});
            return 1;
        };

        let tareaDespues = await funcionesDeTest.crearTarea(baseDeDatos.empleados[0].id_empleado,area,areaApoyo, `tarea de prueba`,proyecto.id_proyecto,1,1,fechaInicio,fechaFin,'texto de pruebas para tareas',50);
        

        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Cambio de la tarea de forma correcta','tarea de prueba',apis.error,1);

        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Diferencia con la tarea origianl',0,apis.error,1);
        
        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'texto de pruebas para tareas',0,apis.error,1);

        resultadoTest = await funcionesDeTest.crearTest(resultadoTest,'Diferencia entre texto antes y despues de edicion',0,apis.error,1);

        
        

        // Eliminar ejemplos
        await funcionesDeTest.eliminarTarea(tarea1.id_tarea);
        await funcionesDeTest.eliminarProyecto(proyecto.id_proyecto);
        await funcionesDeTest.eliminarAmbienteGenerico(baseDeDatos);    

        res.json({resultadoTest,resultadoApi:apis});

    },

    deleteTarea: async (req,res) => {
        let resultadoTest = {}



        res.json({resultadoTest,resultadoApi:apis});
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
        user:{id: 4,nombre: 'Francisco Lema',area: 1,puesto: 2,mail: 'franciscolemacr@gmail.com'}
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