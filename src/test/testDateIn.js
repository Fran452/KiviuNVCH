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
        let ahora = new Date()
        let indicadorEjemplo = await funcionesDeTest.crearIndicador(1,1,2,'indicador de prueba','indicador para las prubeas de funcionalidad',1,ahora);


        // Busco indicador de prueba
        let indicadorDePrueba = await buscarIndicadorEjemplo(indicadorEjemplo.id_indicador);

        // Modifico indicador de prueba
        let modificacionApisJSON = await fetch('http://localhost:3030/apis/dateIn/editIndicador',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
           body: JSON.stringify({
            responsable : "testUser@kiviu.com",
            empleadoSuplente : "franciscolemacr@gmail.com",
            tipo_recordartorio : 2,
            nombre_indicador : "indicador de prueba Editado",
            detalles_metrica : "indicador para las prubeas de funcionalidad editado",
            user:{id: 4,nombre: 'Francisco Lema',area: 1,puesto: 2,mail: 'franciscolemacr@gmail.com'},
            indicador: indicadorDePrueba
            })
        });

        let modificacionApis = await modificacionApisJSON.json();

        let indicadorDePruebaModificado = await buscarIndicadorEjemplo(indicadorEjemplo.id_indicador);

        modificacionApis.objeto = indicadorDePruebaModificado;

        // test de restorno de apis
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,"Sin errores de Base de datos",0,modificacionApis.error,1);

        // test modificacion responsable
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,"modificacion responsable",'testUser@kiviu.com',indicadorDePruebaModificado.Empleados.mail,1);

        // test modificacion responsable suplente
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,"modificacion responsable suplente",'franciscolemacr@gmail.com',indicadorDePruebaModificado.ResponsableSuplente.mail,1);

        // test modificacion tipo de recordatorio
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,"tipo de recordatorio",2,indicadorDePruebaModificado.tipo_recordartorio,1);

        // test modificacion nombre
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,"modificacion nombre",'indicador de prueba Editado',indicadorDePruebaModificado.nombre_indicador,1);

        // test modificacion detalle
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,"modificacion detalle",'indicador para las prubeas de funcionalidad editado',indicadorDePruebaModificado.detalles_metrica,1);        

        // Eliminar indicadores de prueba
        await funcionesDeTest.eliminarIndicadorEjemplo(indicadorEjemplo.id_indicador);

        res.json({resultadoTest,resultadoApi:modificacionApis});

    },

    deleteIndicadores: async (req,res) => {
        let resultadoTest = {};
        
        // creo indicador de prueba
        let ahora = new Date()
        let indicadorEjemplo = await funcionesDeTest.crearIndicador(1,1,2,'indicador de prueba','indicador para las prubeas de funcionalidad',1,ahora);

        let IdindicadorDePrueba = indicadorEjemplo.id_indicador;

        // Busco indicador de prueba
        let indicadorDePrueba = await buscarIndicadorEjemplo(IdindicadorDePrueba);

        // eliminio el indicador de prueba
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


        // test de restorno de apis
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,"Sin errores de apis",0,apisEliminado.error,1);


        // Eliminacion de archivos
        if(indicadorDePrueba.mostrar == 1 && indicadorDePruebaEliminado.mostrar == 0) {
            resultadoTest = funcionesDeTest.crearTestCorrecto(resultadoTest,'Eliminacion de Indicador');

        }else{
            resultadoTest = funcionesDeTest.crearTestError(resultadoTest,'Eliminacion de Indicador',`view antes: ${1} / view despues: ${0}`,`view antes: ${indicadorDePrueba.mostrar} / view despues: ${indicadorDePruebaEliminado.mostrar}`);
        }

        // eliminacion de test
        await funcionesDeTest.eliminarIndicadorEjemplo(IdindicadorDePrueba);

        res.json({resultadoTest,resultadoApi:apisEliminado});

    },

    newMetrica: async (req,res) => {
        let resultadoTest = {};
        const ahora = new Date();
        let indicador = await funcionesDeTest.crearIndicador(1,1,2,'indicador de prueba','indicador de prueba para prueba de metricas',1,ahora);

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
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,"Sin errores de apis",0,apis.error,1);
        
        if(resultadoTest.test0.estado == "Error"){
            res.json({resultadoTest,resultadoApi:apis});
            return 1;
        }

        // Subida base de datos 
        let metricaEjemplo = await buscarMetricaEjemplo(apis.objeto.id_metrica);

        resultadoTest = funcionesDeTest.crearTest(resultadoTest,"Subida a base de datos",undefined,metricaEjemplo,4);

        if(resultadoTest.test1.estado != "Error"){

            // subida de dato
            resultadoTest = funcionesDeTest.crearTest(resultadoTest,"Dato de la metrica",100,metricaEjemplo.dato_metrica,1);

            // fecha de subida
            const fechaBuscada = new Date().toLocaleDateString('es-ES').replace(/\//g, '-');
            const fechaDeLaMetrica = new Date(metricaEjemplo.fecha_Metrica).toLocaleDateString('es-ES').replace(/\//g, '-');

            resultadoTest = funcionesDeTest.crearTest(resultadoTest,"fecha de la metrica",fechaBuscada,fechaDeLaMetrica,1);


            // Fecha del recordatorrio modificada
            let indicadorEditado = await buscarIndicadorEjemplo(indicador.id_indicador);
            ahora.setDate(ahora.getDate() + 7);
            let fechaBuscadaISO = ahora.toISOString().split('T')[0];
            let fechaBD = indicadorEditado.dataValues.fecha_del_recodatorio.split('T')[0]

            resultadoTest = funcionesDeTest.crearTest(resultadoTest,"Fecha del recordatorrio modificada",fechaBuscadaISO,fechaBD,1);

            // detalle del usuario
            resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Nombre del ingresante de la metrica','Francisco Lema',metricaEjemplo.Empleados.nombre,1);

        }

        await funcionesDeTest.eliminarMetricaEjemplo(apis.objeto.id_metrica);
        await funcionesDeTest.eliminarIndicadorEjemplo(indicador.id_indicador);
        res.json({resultadoTest,resultadoApi:apis});

    },

    editMetrica: async (req,res) => {
        let resultadoTest = {}; 
        const ahora = new Date();
        
        // creacion indicador de test
        let indicador = await funcionesDeTest.crearIndicador(1,1,2,'indicador de prueba','indicador de prueba para prueba de metricas',1,ahora);

        // creacion metrica test
        let metrica = await funcionesDeTest.crearMetrica(indicador.id_indicador,500,'2024-08-07',1);
        
        // busqueda de metrica test  
        let metricaCreada = await funcionesDeTest.buscarMetricaEjemplo(metrica.id_metrica);

        // edicion metrica test
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
        let metricaEditada = await funcionesDeTest.buscarMetricaEjemplo(metricaCreada.id_metrica);
        
        // retorno de error 
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apisEditMetrica.error,1);

        if(resultadoTest.test0.estado == 'Error'){
            res.json({resultadoTest,resultadoApi:metricaEditada});
            return 0
        }
        
        // diferencia entre metrica antigua
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Diferencia entre metrica subida y metrica editada',metricaCreada.dato_metrica,metricaEditada.dato_metrica,4);


        // edicion de dato metrica
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Edicion de dato metrica',100,metricaEditada.dato_metrica,1);

        // Edicion de usuario
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Edicion de usuario','Nombre Apellico',metricaEditada.Empleados.nombre,1);

        // eliminacion de elementos de test
        await funcionesDeTest.eliminarMetricaEjemplo(metricaCreada.id_metrica);
        await funcionesDeTest.eliminarIndicadorEjemplo(indicador.id_indicador);
        res.json({resultadoTest,resultadoApi:apisEditMetrica});
    },

    ultimasTresMetricas: async (req,res) => {
        let resultadoTest = {}; 

        // crear indicador de prueba
        let ahora = new Date()
        let indicador = await funcionesDeTest.crearIndicador(1,1,2,'indicador de prueba','indicador de prueba para prueba de metricas',1,ahora);
        
        // crear metricas de prueba
        let apisNewMetrica1 = await funcionesDeTest.crearMetrica(indicador.id_indicador,100,'2024-08-07',1);
        let apisNewMetrica2 = await funcionesDeTest.crearMetrica(indicador.id_indicador,200,'2024-08-06',1);
        let apisNewMetrica3 = await funcionesDeTest.crearMetrica(indicador.id_indicador,300,'2024-08-05',1);

        let ejemplos = {
            ejemplo1 : apisNewMetrica1,
            ejemplo2 : apisNewMetrica2,
            ejemplo3 : apisNewMetrica3
        };

        // correr api
        let apisEnvio3MetricasJSON = await fetch('http://localhost:3030/apis/dateIn/ultimas3Metricas',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
           body: JSON.stringify({
            fkIndicador : indicador.id_indicador,
            user:{id: 1,nombre: 'Francisco Lema',area: 1,puesto: 2,mail: 'franciscolemacr@gmail.com'}
            })
        });
        let apisEnvio3Metricas = await apisEnvio3MetricasJSON.json();

        // retorno de error 
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Sin errores de apis',0,apisEnvio3Metricas.error,1);

        if(resultadoTest.test0.estado == 'Error'){
            res.json({resultadoTest,resultadoApi:metricaEditada});
            return 0
        }

        // Mostrar primer ejemplo
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Primera metrica encontrado',ejemplos.ejemplo1.id_metrica,apisEnvio3Metricas.objeto[0].id_metrica,1);

        // Mostrar segundo ejemplo
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Segunda metrica encontrado',ejemplos.ejemplo2.id_metrica,apisEnvio3Metricas.objeto[1].id_metrica,1);

        // Mostrar tercer ejemplo
        resultadoTest = funcionesDeTest.crearTest(resultadoTest,'Tercero metrica encontrado',ejemplos.ejemplo3.id_metrica,apisEnvio3Metricas.objeto[2].id_metrica,1);

        // eliminacion de elementos de test
        await funcionesDeTest.eliminarMetricaEjemplo(ejemplos.ejemplo1.id_metrica);
        await funcionesDeTest.eliminarMetricaEjemplo(ejemplos.ejemplo2.id_metrica);
        await funcionesDeTest.eliminarMetricaEjemplo(ejemplos.ejemplo3.id_metrica);

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