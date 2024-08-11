const dataBaseSQL = require("../databaseSQL/models");
const funcionesDeTest = require('./funcionesTestGenericas')

const path = require("path");

const bcrypt = require("bcrypt");
const funcionesGenericas = require("../funcionesGenerales");


const controlador = {
    
    testGenerico: async (req,res) => {
        
        let testViewIndicadoresJSON = await fetch("http://localhost:3030/test/dateIn/viewIndicador",{
                method:'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            });
        let testViewIndicadores = await testViewIndicadoresJSON.json();
        
        let testNewIndicadoresJSON = await fetch("http://localhost:3030/test/dateIn/newIndicador",{
            method:'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })  
        let testNewIndicadores = await testNewIndicadoresJSON.json();
        

        let testEditIndicadoresJSON      = await fetch("http://localhost:3030/test/dateIn/editIndicador",{
            method:'GET',
            headers: {
                "Content-Type": "application/json"
            }
        });
        let testEditIndicadores = await testEditIndicadoresJSON.json();

        let testDeleteIndicadoresJSON = await fetch("http://localhost:3030/test/dateIn/deleteIndicador",{
            method:'GET',
            headers: {
                "Content-Type": "application/json"
            }
        });    
        let testDeleteIndicadores = await testDeleteIndicadoresJSON.json();
        
        let testNewMetricaJSON = await fetch("http://localhost:3030/test/dateIn/newMetrica",{
            method:'GET',
            headers: {
                "Content-Type": "application/json"
            }
        });    
        let testNewMetrica = await testNewMetricaJSON.json(); 
        
        let testEditMetricaJSON = await fetch("http://localhost:3030/test/dateIn/editMegrica",{
            method:'GET',
            headers: {
                "Content-Type": "application/json"
            }
        });    
        let testEditMetrica = await testEditMetricaJSON.json();

        let testView3MetricaJSON = await fetch("http://localhost:3030/test/dateIn/ultimasTresMetricas",{
            method:'GET',
            headers: {
                "Content-Type": "application/json"
            }
        });    
        let testView3Metrica = await testView3MetricaJSON.json();

        let retorno = {
            indicadores:{
                view    : testViewIndicadores,
                new     : testNewIndicadores,
                edit    : testEditIndicadores,
                delete  : testDeleteIndicadores
            },
            metrica:{
                new:testNewMetrica,
                edit:testEditMetrica,
                view3metricas:testView3Metrica,
            }
        }

        res.json(retorno);
    },

    
    // Test de view dateIn
    viewIndicadores: async (req,res) => {

    let resultadoTest = {}
    /* agregar test para colores */ 
    let ahora = new Date();
    let fechaBlue = new Date();

   fechaBlue.setDate(fechaBlue.getDate() + 2);

    let fechaGrean = new Date();
    fechaGrean.setDate(fechaGrean.getDate() + 7);

    let indicador1 = await funcionesDeTest.crearIndicador(1,1,2,'indicador de prueba1','indicador de prueba para prueba de metricas color rojo',1,ahora);
    let indicador2 = await funcionesDeTest.crearIndicador(1,1,2,'indicador de prueba2','indicador de prueba para prueba de metricas color azul',1,fechaBlue);
    let indicador3 = await funcionesDeTest.crearIndicador(1,1,2,'indicador de prueba3','indicador de prueba para prueba de metricas color verde',1,fechaGrean);

    fetch('http://localhost:3030/apis/dateIn',{
        method:'POST',
        headers: {
            "Content-Type": "application/json"
        },
       body: JSON.stringify({user:{id: 1,nombre: 'Francisco Lema',area: 1,puesto: 2,mail: 'franciscolemacr@gmail.com'}})
    })
    .then(apis => {
        return apis.json();
    })
    .then(async apis => {
        // Sin errores en api
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,"Sin errores de Base de datos",0,apis.error,1);
        
        // view primer indicador
        let primerIndicador = apis.objeto.find(indicador => indicador.id_indicador == indicador1.id_indicador);
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,"indicador de prueba1",'indicador de prueba1',primerIndicador.nombre_indicador,1);

        // Color del primer indicador vencido
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,"Primer indicador color",'#DC3545',primerIndicador.color,1);

        // view segundo indicador
        let segundoIndicador = apis.objeto.find(indicador => indicador.id_indicador == indicador2.id_indicador);
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Segundo indicador nombre','indicador de prueba2',segundoIndicador.nombre_indicador,1);

        // Color del primer indicador vencido
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Segundo indicador color','#17A2B8',segundoIndicador.color,1);

        // view tercer indicador 
        let tercerIndicador = apis.objeto.find(indicador => indicador.id_indicador == indicador3.id_indicador);
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Tercer indicador nombre','indicador de prueba3',tercerIndicador.nombre_indicador,1);

        // Color del primer indicador vencido
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Tercer indicador color','#28A745',tercerIndicador.color,1);


        await funcionesDeTest.eliminarIndicadorEjemplo(indicador1.id_indicador);
        await funcionesDeTest.eliminarIndicadorEjemplo(indicador2.id_indicador);
        await funcionesDeTest.eliminarIndicadorEjemplo(indicador3.id_indicador);

        res.json({resultadoTest,resultadoApi:apis});
        
    })
    .catch(error => {
        console.log(error);
    });

    },

    newindicador: async (req,res) => {
        let resultadoTest = {};
        fetch('http://localhost:3030/apis/dateIn/newIndicador',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
            responsable : "franciscolemacr@gmail.com",
            empleadoSuplente : "testUser@kiviu.com",
            tipo_recordartorio : 1,
            nombre_indicador : "indicador de prueba",
            detalles_metrica : "indicador para las prubeas de funcionalidad",
            user:{id: 4,nombre: 'Francisco Lema',area: 1,puesto: 2,mail: 'franciscolemacr@gmail.com'}})
        })
        .then(apis => {
            return apis.json();
        })
        .then(async (apis) => {

            
            // test de restorno de apis
            resultadoTest = funcionesDeTest.crearTest(resultadoTest,"Sin errores de Base de datos",0,apis.error,1);
            
            

            // test de subida a base de datos
            let indicadorsubido = await funcionesDeTest.buscarIndicadorEjemplo(apis.objeto.id_indicador);

            if(indicadorsubido != undefined){
                    resultadoTest = funcionesDeTest.crearTestCorrecto(resultadoTest,"Objeto subido");

                    // Test de fecha
                    let fechaBuscada = new Date();
                    fechaBuscada.setDate(fechaBuscada.getDate() + 7);
                    let fechaBuscadaISO = fechaBuscada.toISOString().split('T')[0];
                    let fechaBD = apis.objeto.fecha_del_recodatorio.split('T')[0];

                    resultadoTest = funcionesDeTest.crearTest(resultadoTest,"Fecha del recordatorrio",fechaBuscadaISO,fechaBD,1);

                    // test de usuario responsable
                    resultadoTest = funcionesDeTest.crearTest(resultadoTest,"Fecha del recordatorrio",indicadorsubido.Empleados.nombre,'Francisco Lema',1);
                    
                    // test de usuario suplente 
                    resultadoTest = funcionesDeTest.crearTest(resultadoTest,"Fecha del recordatorrio",indicadorsubido.ResponsableSuplente.nombre,'Nombre Apellico',1);
                    
            }else{
                resultadoTest = funcionesDeTest.crearTestCorrecto(resultadoTest,"Objeto subido",0,indicadorsubido);
            }

            await funcionesDeTest.eliminarIndicadorEjemplo(apis.objeto.id_indicador);

            res.json({resultadoTest,resultadoApi:apis});
          
        })
        .catch(error => {
            console.log(error);
        })
    },

    editIndicadores: async (req,res) => {
        let resultadoTest = {};
        // creo indicador de prueba
        let creacionApisJSON = await fetch('http://localhost:3030/apis/dateIn/newIndicador',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
           body: JSON.stringify({
            responsable : "franciscolemacr@gmail.com",
            empleadoSuplente : "testUser@kiviu.com",
            tipo_recordartorio : 1,
            nombre_indicador : "indicador de prueba",
            detalles_metrica : "indicador para las prubeas de funcionalidad",
            user:{id: 4,nombre: 'Francisco Lema',area: 1,puesto: 2,mail: 'franciscolemacr@gmail.com'}}
        )});

        let  creacionApis = await creacionApisJSON.json();
        let IdindicadorDePrueba = creacionApis.objeto.id_indicador;

        // Busco indicador de prueba
        let indicadorDePrueba = await buscarIndicadorEjemplo(IdindicadorDePrueba);

        // Modifico indicador de prueba
        let modificacionApisJSON = await fetch('http://localhost:3030/apis/dateIn/editIndicador',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
           body: JSON.stringify({
            responsable : "testUser@kiviu.com",
            empleadoSuplente : "franciscolemacr@gmail.com",
            tipo_recordartorio : 1,
            nombre_indicador : "indicador de prueba Editado",
            detalles_metrica : "indicador para las prubeas de funcionalidad editado",
            user:{id: 4,nombre: 'Francisco Lema',area: 1,puesto: 2,mail: 'franciscolemacr@gmail.com'},
            indicador: indicadorDePrueba
            })
        });

        let modificacionApis = await modificacionApisJSON.json();

        let indicadorDePruebaModificado = await buscarIndicadorEjemplo(IdindicadorDePrueba);

        modificacionApis.objeto = indicadorDePruebaModificado;

        if(modificacionApis.error == 0){
            resultadoTest.test0 = {
                descripcion : "Subida a base de datos",
                estado : "Correcto"
            }
        }else{
            resultadoTest.test0 = {
                descripcion : "Subida a base de datos",
                estado : "Error"
            }
            res.json({resultadoTest,resultadoApi:apis});
        }

        // test modificacion responsable
        if(indicadorDePruebaModificado.Empleados.mail == "testUser@kiviu.com"){
            resultadoTest.test1 = {
                descripcion : "modificacion responsable",
                estado : "Correcto"
            }
        }else{
            resultadoTest.test1 = {
                descripcion : "modificacion responsable",
                estado : "Error"
            }
        }

        // test modificacion responsable suplente
        if(indicadorDePruebaModificado.ResponsableSuplente.mail == "franciscolemacr@gmail.com"){
            resultadoTest.test2 = {
                descripcion : "modificacion responsable suplente",
                estado : "Correcto"
            }
        }else{
            resultadoTest.test2 = {
                descripcion : "modificacion responsable suplente",
                estado : "Error"
            }
        }

        // test modificacion tipo de recordatorio
        if(indicadorDePruebaModificado.tipo_recordartorio == 2){
            resultadoTest.test3 = {
                descripcion : "tipo de recordatorio",
                estado : "Correcto"
            }
        }else{
            resultadoTest.test3 = {
                descripcion : "tipo de recordatorio",
                estado : "Error"
            }
        }

        // test modificacion nombre
        if(indicadorDePruebaModificado.nombre_indicador == "indicador de prueba Editado" && indicadorDePruebaModificado.nombre_indicador != indicadorDePrueba.nombre_indicador){
            resultadoTest.test4 = {
                descripcion : "modificacion nombre",
                estado : "Correcto"
            }
        }else{
            resultadoTest.test4 = {
                descripcion : "modificacion nombre",
                estado : "Error"
            }
        }

        // test modificacion detalle
        if(indicadorDePruebaModificado.detalles_metrica == "indicador para las prubeas de funcionalidad editado"){
            resultadoTest.test3 = {
                descripcion : "modificacion detalle",
                estado : "Correcto"
            }
        }else{
            resultadoTest.test3 = {
                descripcion : "modificacion detalle",
                estado : "Error"
            }
        }
        

        await eliminarIndicadorEjemplo(IdindicadorDePrueba);
        res.json({resultadoTest,resultadoApi:modificacionApis});

    },

    deleteIndicadores: async (req,res) => {
        let resultadoTest = {};
         // creo indicador de prueba
         let creacionApisJSON = await fetch('http://localhost:3030/apis/dateIn/newIndicador',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
           body: JSON.stringify({
            responsable : "franciscolemacr@gmail.com",
            empleadoSuplente : "testUser@kiviu.com",
            tipo_recordartorio : 1,
            nombre_indicador : "indicador de prueba",
            detalles_metrica : "indicador para las prubeas de funcionalidad",
            user:{id: 4,nombre: 'Francisco Lema',area: 1,puesto: 2,mail: 'franciscolemacr@gmail.com'}}
        )});

        let  creacionApis = await creacionApisJSON.json();
        let IdindicadorDePrueba = creacionApis.objeto.id_indicador;

        // Busco indicador de prueba
        let indicadorDePrueba = await buscarIndicadorEjemplo(IdindicadorDePrueba);

        let apisEliminadoJSON = await fetch('http://localhost:3030/apis/dateIn/deleteIndicador',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
           body: JSON.stringify({
            idIndicador : IdindicadorDePrueba , 
            user:{id: 4,nombre: 'Francisco Lema',area: 1,puesto: 2,mail: 'franciscolemacr@gmail.com'}
            })
        })
        let apisEliminado = await apisEliminadoJSON.json();

        let indicadorDePruebaEliminado = await buscarIndicadorEjemplo(IdindicadorDePrueba);

        // Subida a base de datos 
        if(apisEliminado.error == 0){
            resultadoTest.test0 = {
                descripcion : "Subida a base de datos",
                estado : "Correcto"
            }
        }else{
            resultadoTest.test0 = {
                descripcion : "Subida a base de datos",
                estado : "Error"
            }
        }

        // Eliminacion de archivos
        if(indicadorDePrueba.mostrar == 1 && indicadorDePruebaEliminado.mostrar == 0) {
            resultadoTest.test1 = {
                descripcion : "Eliminacion de Indicador",
                estado : "Correcto"
            }
        }else{
            resultadoTest.test1 = {
                descripcion : "Eliminacion de Indicador",
                estado : "Error",
                buscado:indicadorDePruebaEliminado,
                restorno:indicadorDePrueba,
            }
        }

        await eliminarIndicadorEjemplo(IdindicadorDePrueba);

        res.json({resultadoTest,resultadoApi:apisEliminado});

    },

    newMetrica: async (req,res) => {
        let resultadoTest = {};
        const ahora = new Date();
        let indicador = await crearIndicador(1,1,2,'indicador de prueba','indicador de prueba para prueba de metricas',1,ahora);

        console.log(indicador);
        let apisJSON = await fetch('http://localhost:3030/apis/dateIn/newMetrica',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fk_indicador : indicador.id_indicador,
                dato_metrica : 100,
                user:{id: 1,nombre: 'Francisco Lema',area: 1,puesto: 2,mail: 'franciscolemacr@gmail.com'}
            })
        })
        
        let apis = await apisJSON.json();

        // retorno de error 
        if(apis.error == 0){
            resultadoTest.test0 = {
                descripcion : "retorno de error",
                estado : "Correcto"
            }
        }else{
            resultadoTest.test0 = {
                descripcion : "retorno de error",
                estado : "Error"
            }
            res.json({resultadoTest,resultadoApi:apis});
            return 0;
        }

        // Subida base de datos 
        let metricaEjemplo = await buscarMetricaEjemplo(apis.objeto.id_metrica)
        if(metricaEjemplo != undefined){
            resultadoTest.test1 = {
                descripcion : "Subida a base de datos",
                estado : "Correcto"
            }

            // subida de dato
            if(metricaEjemplo.dato_metrica == 100){
                resultadoTest.test2 = {
                    descripcion : "Dato de la metrica",
                    estado : "Correcto"
                }
            }else{
                resultadoTest.test2 = {
                    descripcion : "Dato de la metrica",
                    estado : "Error",
                    Esperado : 100,
                    Recibido : metricaEjemplo.dato_metrica
                }
            }

            // fecha de subida
            
            const fechaBuscada = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}`;  
            
            if(metricaEjemplo.fecha_Metrica = fechaBuscada){
                resultadoTest.test3 = {
                    descripcion : "fecha de la metrica",
                    estado : "Correcto"
                }
            }else{
                resultadoTest.test3 = {
                    descripcion : "fecha de la metrica",
                    estado : "Error",
                    Esperado : fechaBuscada,
                    Recibido : metricaEjemplo.fecha_Metrica
                }
            }


            // Modificacion recodatorio del indicador
            console.log(indicador.id_indicador);
            let indicadorEditado = await buscarIndicadorEjemplo(indicador.id_indicador);
            ahora.setDate(ahora.getDate() + 7);
            let fechaBuscadaISO = ahora.toISOString().split('T')[0];
            let fechaBD = indicadorEditado.dataValues.fecha_del_recodatorio.split('T')[0]

            if(fechaBD == fechaBuscadaISO){
                resultadoTest.test5 = {
                    descripcion : "Fecha del recordatorrio",
                    estado      : "Correcto"
                }
            }else{
                resultadoTest.test5 = {
                    descripcion : "Fecha del recordatorrio",
                    estado      : "Error",
                    esperado    : fechaBuscadaISO,
                    recibido    : fechaBD
                }
            }

            // detalle del usuario
            if(metricaEjemplo.Empleados.nombre == "Francisco Lema"){
                resultadoTest.test4 = {
                    descripcion : "Nombre del ingresante de la metrica",
                    estado : "Correcto"
                }
            }else{
                resultadoTest.test4 = {
                    descripcion : "Nombre del ingresante de la metrica",
                    estado : "Error",
                    Esperado : "Francisco Lema",
                    Recibido : metricaEjemplo.Empleados.nombre
                }
            }

        }else{
            resultadoTest.test1 = {
                descripcion : "Subida a base de datos",
                estado : "Error"
            }
        }

        
        await eliminarMetricaEjemplo(apis.objeto.id_metrica);
        await eliminarIndicadorEjemplo(indicador.id_indicador)
        res.json({resultadoTest,resultadoApi:apis});

    },

    editMetrica: async (req,res) => {
        let resultadoTest = {}; 
        const ahora = new Date();

        let indicador = await crearIndicador(1,1,2,'indicador de prueba','indicador de prueba para prueba de metricas',1,ahora);

        let metrica = await crearMetrica(indicador.id_indicador,500,'2024-08-07',1);

        let metricaCreada = await buscarMetricaEjemplo(metrica.id_metrica);

        let apisEditMetricaJSON = await fetch('http://localhost:3030/apis/dateIn/editMegrica',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
           body: JSON.stringify({
            dato_metrica: 100,
            idMetrica: metricaCreada.id_metrica,
            user:{id: 2,nombre: 'Nombre Apellico',area: 1,puesto: 2,mail: 'testUser@kiviu.com'}
            })
        });

        let apisEditMetrica = await apisEditMetricaJSON.json();
        let metricaEditada = await buscarMetricaEjemplo(metricaCreada.id_metrica);
        
        // retorno de error 
        if(apisEditMetrica.error == 0){
            resultadoTest.test0 = {
                descripcion : "retorno de error",
                estado : "Correcto"
            }
        }else{
            resultadoTest.test0 = {
                descripcion : "retorno de error",
                estado : "Error"
            }
            res.json({resultadoTest,resultadoApi:metricaEditada});
            return 0
        }
        
        // diferencia entre metrica antigua
        if(metricaEditada.dato_metrica != metricaCreada.dato_metrica){
            resultadoTest.test1 = {
                descripcion : "Diferencia entre metrica subida y metrica editada",
                estado : "Correcto"
            };
        }else{
            resultadoTest.test1 = {
                descripcion : "Diferencia entre metrica subida y metrica editada",
                estado : "Error"
            };
        }

        // edicion de dato metrica
        if(metricaEditada.dato_metrica == 100){
            resultadoTest.test2 = {
                descripcion : "edicion de dato metrica",
                estado : "Correcto"
            };
        }else{
            resultadoTest.test2 = {
                descripcion : "edicion de dato metrica",
                estado : "Error",
                esperado: 100,
                recibido:metricaEditada.dato_metrica
            };
        }

        // Edicion de usuario
        if(metricaEditada.Empleados.nombre == 'Nombre Apellico'){
            resultadoTest.test3 = {
                descripcion : 'Edicion de usuario',
                estado : "Correcto"
            };
        }else{
            resultadoTest.test3 = {
                descripcion : "Edicion de usuario",
                estado : "Error",
                esperado:'Nombre Apellico',
                recibido:metricaEditada.Empleados.nombre
            };
        }

        await eliminarMetricaEjemplo(metricaCreada.id_metrica);
        res.json({resultadoTest,resultadoApi:apisEditMetrica});
    },

    ultimasTresMetricas: async (req,res) => {
        let resultadoTest = {}; 

        // fk_indicador,dato_metrica,fecha_Metrica,hora_Metrica,log_de_usuario
        let apisNewMetrica1 = await crearMetrica(1,100,'2024-08-07',1);
        let apisNewMetrica2 = await crearMetrica(1,200,'2024-08-06',1);
        let apisNewMetrica3 = await crearMetrica(1,300,'2024-08-05',1);
        let ejemplos = {
            ejemplo1 : apisNewMetrica1,
            ejemplo2 : apisNewMetrica2,
            ejemplo3 : apisNewMetrica3
        };

        let apisEnvio3MetricasJSON = await fetch('http://localhost:3030/apis/dateIn/ultimas3Metricas',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
           body: JSON.stringify({
            fkIndicador : 1,
            user:{id: 1,nombre: 'Francisco Lema',area: 1,puesto: 2,mail: 'franciscolemacr@gmail.com'}
            })
        });
        let apisEnvio3Metricas = await apisEnvio3MetricasJSON.json();

        // retorno de error 
        if(apisEnvio3Metricas.error == 0){
            resultadoTest.test0 = {
                descripcion : "retorno de error",
                estado : "Correcto"
            }
        }else{
            resultadoTest.test0 = {
                descripcion : "retorno de error",
                estado : "Error"
            }
            res.json({resultadoTest,resultadoApi:apisEnvio3Metricas});
            return 0;
        }

        // Mostrar primer ejemplo
        if(apisEnvio3Metricas.objeto[0].id_metrica == ejemplos.ejemplo1.id_metrica){
            resultadoTest.test1 = {
                descripcion : "retorno de error",
                estado : "Correcto"
            }
        }else{
            resultadoTest.test1 = {
                descripcion : "retorno de error",
                estado : "Error"
            }
        }

        // Mostrar segundo ejemplo
        if(apisEnvio3Metricas.objeto[1].id_metrica == ejemplos.ejemplo2.id_metrica){
            resultadoTest.test2 = {
                descripcion : "retorno de error",
                estado : "Correcto"
            }
        }else{
            resultadoTest.test2 = {
                descripcion : "retorno de error",
                estado : "Error"
            }
        }

        // Mostrar tercer ejemplo
        if(apisEnvio3Metricas.objeto[2].id_metrica == ejemplos.ejemplo3.id_metrica){
            resultadoTest.test3 = {
                descripcion : "retorno de error",
                estado : "Correcto"
            }
        }else{
            resultadoTest.test3 = {
                descripcion : "retorno de error",
                estado : "Error"
            }
        }

        await eliminarMetricaEjemplo(ejemplos.ejemplo1.id_metrica);
        await eliminarMetricaEjemplo(ejemplos.ejemplo2.id_metrica);
        await eliminarMetricaEjemplo(ejemplos.ejemplo3.id_metrica);

        res.json({resultadoTest,resultadoApi:apisEnvio3Metricas});
    },
}

module.exports = controlador;

async function crearIndicador(fk_area,fk_responsable,fk_responsable_suplente,nombre_indicador,detalles_metrica,tipo_recordartorio,fecha_del_recodatorio){
    let indicador = await dataBaseSQL.indicadores.create({
        fk_area : fk_area,
        fk_responsable : fk_responsable,
        fk_responsable_suplente : fk_responsable_suplente,
        nombre_indicador : nombre_indicador,
        detalles_metrica : detalles_metrica,
        tipo_recordartorio : tipo_recordartorio,
        fecha_del_recodatorio : fecha_del_recodatorio,
        mostrar:1
    });
    return indicador.dataValues;
}

async function eliminarIndicadorEjemplo(id) {
    await dataBaseSQL.indicadores.destroy({
        where : {id_indicador: id}
    });
}

async function buscarIndicadorEjemplo(id) {
    let indicadores = await dataBaseSQL.indicadores.findAll({
        where: {
            id_indicador : id
        },
        attributes: ['id_indicador','nombre_indicador','detalles_metrica','tipo_recordartorio',"mostrar",'fecha_del_recodatorio'],
        include: [
            {association : "Areas",attributes: ['id_area','nombre_del_Area']},
            {association : "Empleados",attributes: ['nombre','mail']},
            {association : "ResponsableSuplente",attributes: ['nombre','mail']}
        ]
    });
    let busqueda = indicadores.find(indicador => indicador.id_indicador == id);
    return busqueda;
}

async function eliminarMetricaEjemplo(id) {
    await dataBaseSQL.metricas.destroy({
        where : {id_metrica: id}
    });

}

async function buscarMetricaEjemplo(id) {
    let metrica = await dataBaseSQL.metricas.findAll({
        where: {
            id_metrica : id
        },
        include: [{association : "Empleados",attributes: ['nombre','mail']}]
    });
    let busqueda = metrica.find(metrica => metrica.id_metrica == id);
    return busqueda;
}

async function crearMetrica(fk_indicador,dato_metrica,fecha_Metrica,log_de_usuario) {
    let metrica = await dataBaseSQL.metricas.create({
        fk_indicador:   fk_indicador,
        dato_metrica:   dato_metrica,
        fecha_Metrica:  fecha_Metrica,
        log_de_usuario: log_de_usuario
    });
    return metrica.dataValues;
}
/*

let apisJSON = await fetch('http://localhost:3030/apis/dateIn/newIndicador',{
    method:'POST',
    headers: {
        "Content-Type": "application/json"
    },
   body: JSON.stringify({
    user:{id: 4,nombre: 'Francisco Lema',area: 1,puesto: 2,mail: 'franciscolemacr@gmail.com'}
    })
})

let apis = await apisJSON.json();
    
*/