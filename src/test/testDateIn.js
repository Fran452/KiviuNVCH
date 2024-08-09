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
        
        let testDeleteIndicadoresJSON    = await fetch("http://localhost:3030/test/dateIn/deleteIndicador",{
                    method:'GET',
                    headers: {
                        "Content-Type": "application/json"
                    }
        });    
        let testDeleteIndicadores = await testDeleteIndicadoresJSON.json(); 
        
        let retorno = {
            indicadores:{
                view    : testViewIndicadores,
                new     : testNewIndicadores,
                edit    : testEditIndicadores,
                delete  : testDeleteIndicadores
            }
            
        }

        res.json(retorno);
    },

    
    // Test de view dateIn
  viewIndicadores: async (req,res) => {
    let resultadoTest = {}
    /* agregar test para colores */ 
    console.log("test de ver indicadores");
    
    fetch('http://localhost:3030/apis/dateIn',{
        method:'POST',
        headers: {
            "Content-Type": "application/json"
        },
       body: JSON.stringify({user:{id: 4,nombre: 'Francisco Lema',area: 1,puesto: 2,mail: 'franciscolemacr@gmail.com'}})
    })
    .then(apis => {
        return apis.json();
    })
    .then(apis => {
        
        // test de restorno de apis
        if(apis.error == 0){
            resultadoTest.test0 = {
                descripcion : "Sin errores de Base de datos",
                estado      : "Correcto"    
            }
        }else{
             resultadoTest.test0  = {
                descripcion : "Sin errores de Base de datos",
                estado      : "Error"    
            }
        }

        // view primer indicador
        if(apis.objeto[0].nombre_indicador == 'Ventas Mensuales'){
            resultadoTest.test1 = {
                descripcion : "Primer indicador Ventas Mensuales",
                estado      : "Correcto"
            }

        }else{
            resultadoTest.test1 = {
                descripcion : "Primer indicador Ventas Mensuales",
                estado      : "Error"
            }
        }

        // view segundo indicador
        if(apis.objeto[1].nombre_indicador == 'Campañas Publicitarias'){
            resultadoTest.test2 = {
                descripcion:"Segundo indicador Campañas Publicitarias",
                estado: "Correcto"
            }
        }else{
            resultadoTest.test2 = {
                descripcion:"Segundo indicador Campañas Publicitarias",
                estado: "Correcto"
            }
        }
        res.json({resultadoTest,resultadoApi:apis});
        
    })
    .catch(error => {
        console.log(error);
    });

    },

    newindicador: async (req,res) => {

        let resultadoTest = {};

        console.log("test de ver nuevo indicador");
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
            if(apis.error == 0){
                resultadoTest.test0 = {
                    descripcion : "Sin errores de Base de datos",
                    estado      : "Correcto"
                }

            }else{
                resultadoTest.test0 = {
                    descripcion : "Sin errores de Base de datos",
                    estado      : "Error"
                }
            }

            // Test de fecha
            let fechaBuscada = new Date();
            fechaBuscada.setDate(fechaBuscada.getDate() + 7);
            let fechaBuscadaISO = fechaBuscada.toISOString().split('T')[0];
            let fechaBD = apis.objeto.fecha_del_recodatorio.split('T')[0]



            if(fechaBD == fechaBuscadaISO){
                resultadoTest.test1 = {
                    descripcion : "Fecha del recordatorrio",
                    estado      : "Correcto"
                }
            }else{
                resultadoTest.test1 = {
                    descripcion : "Fecha del recordatorrio",
                    estado      : "Error",
                    retorno     : `fecha BD = ${fechaBD} / fecha buscada = ${fechaBuscadaISO}`
                }
            }

            // test de subida a base de datos

            let busquedaBdJSON =  await fetch('http://localhost:3030/apis/dateIn',{
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
               body: JSON.stringify({user:{id: 4,nombre: 'Francisco Lema',area: 1,puesto: 2,mail: 'franciscolemacr@gmail.com'}})
            })
            let busquedaBd = await busquedaBdJSON.json();

            let indicadorsubido = busquedaBd.objeto.find(indicador => indicador.id_indicador == apis.objeto.id_indicador);

                console.log(indicadorsubido);
                if(indicadorsubido != undefined ){
                    resultadoTest.test2 = {
                        descripcion : "Objeto subido",
                        estado : "Correcto"
                    }
    
                    // test de usuario responsable
                    if(indicadorsubido.Empleados.nombre == "Francisco Lema"){
                        resultadoTest.test3 = {
                            descripcion : "Responsable nombre",
                            estado : "Correcto"
                        }
                    }else{
                        resultadoTest.test3 = {
                            descripcion : "Responsable nombre",
                            estado : "Correcto"
                        }
                    }
                    
                    // test de usuario suplente 
                    if(indicadorsubido.ResponsableSuplente.nombre == "Nombre Apellico"){
                        resultadoTest.test4 = {
                            descripcion : "Responsable Suplente nombre",
                            estado : "Correcto"
                        }
                    }else{
                        resultadoTest.test4 = {
                            descripcion : "Responsable Suplente subido",
                            estado : "Correcto"
                        }
                    }
                }else{
                    resultadoTest.test2 = {
                        descripcion : "Objeto subido",
                        estado : "Error"
                    }
                }

                await dataBaseSQL.indicadores.destroy({
                    where : {id_indicador: apis.objeto.id_indicador}
                });

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

        let apisJSON = await fetch('http://localhost:3030/apis/dateIn/newMetrica',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fk_indicador : 1,
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
        console.log(metricaEjemplo);
        console.log(apis.objeto.id_metrica);
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
            const ahora = new Date();
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


            // detalles de la hora
            const horaBuscada = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
            if(metricaEjemplo.hora_Metrica == horaBuscada){
                resultadoTest.test4 = {
                    descripcion : "hora de la metrica",
                    estado : "Correcto"
                }
            }else{
                resultadoTest.test4 = {
                    descripcion : "hora de la metrica",
                    estado : "Error",
                    Esperado : horaBuscada,
                    Recibido : metricaEjemplo.hora_Metrica
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
        res.json({resultadoTest,resultadoApi:apis});

    },

    editMetrica: async (req,res) => {
        let resultadoTest = {}; 
        let NewMetricaJSON = await fetch('http://localhost:3030/apis/dateIn/newMetrica',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
           body: JSON.stringify({
            fk_indicador : 1,
            dato_metrica: 500,
            user:{id: 1,nombre: 'Francisco Lema',area: 1,puesto: 2,mail: 'franciscolemacr@gmail.com'}
            })
        })
        
        let apisNewMetrica = await NewMetricaJSON.json();
        let metricaCreada = await buscarMetricaEjemplo(apisNewMetrica.objeto.id_metrica);

       console.log(apisNewMetrica.objeto.id_metrica);

        let apisEditMetricaJSON = await fetch('http://localhost:3030/apis/dateIn/editMegrica',{
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
           body: JSON.stringify({
            dato_metrica: 100,
            idMetrica: apisNewMetrica.objeto.id_metrica,
            user:{id: 2,nombre: 'Nombre Apellico',area: 1,puesto: 2,mail: 'testUser@kiviu.com'}
            })
        });

        let apisEditMetrica = await apisEditMetricaJSON.json();
        let metricaEditada = await buscarMetricaEjemplo(apisNewMetrica.objeto.id_metrica);

        
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
                esperado:100,
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


        await eliminarMetricaEjemplo(apisNewMetrica.objeto.id_metrica);
        res.json({resultadoTest,resultadoApi:apisEditMetrica});

    },

    ultimasTresMetricas: async (req,res) => {
    },
}

module.exports = controlador;


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
        attributes: ['id_indicador','nombre_indicador','detalles_metrica','tipo_recordartorio',"mostrar"],
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