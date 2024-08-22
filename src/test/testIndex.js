const dataBaseSQL = require("../databaseSQL/models");
const funcionesDeTest = require('./funcionesTestGenericas')

const path = require("path");

const bcrypt = require("bcrypt");
const funcionesGenericas = require("../funcionesGenerales");
const { planesAcción } = require("../controllers/controller");


const controlador = {
    
    testGenerico: async (req,res) => {
        let links = {
            planesAcción:{
                testGenericos: 'http://localhost:3030/test/plan-accion',
                ciclos:{
                    add:    'http://localhost:3030/test/plan-accion/addCiclos',
                    view:   'http://localhost:3030/test/plan-accion/viewCiclos',
                    mod:    'http://localhost:3030/test/plan-accion/modCiclos',
                    delete: 'http://localhost:3030/test/plan-accion/deleteCiclos'
                },
                procesos:{
                    add:    'http://localhost:3030/test/plan-accion/addProceso',
                    view:   'http://localhost:3030/test/plan-accion/viewProcesos',
                    mod:    'http://localhost:3030/test/plan-accion/modProceso',
                    delete: 'http://localhost:3030/test/plan-accion/deleteProceso'
                },
                tareas:{
                    add:    'http://localhost:3030/test/plan-accion/addTask',
                    view:   'http://localhost:3030/test/plan-accion/viewTareas',
                    mod:    'http://localhost:3030/test/plan-accion/modTask',
                    delete: 'http://localhost:3030/test/plan-accion/deleteTask'
                },
            dateIn : {
                testGenericos: 'http://localhost:3030/test/dateIn',
                indicadores:{
                    add:    'http://localhost:3030/test/dateIn/newIndicador',
                    view:   'http://localhost:3030/test/dateIn/viewIndicador',
                    mod:    'http://localhost:3030/test/dateIn/editIndicador',
                    delete: 'http://localhost:3030/test/dateIn/deleteIndicador'
                },
                metricas:{
                    add:    'http://localhost:3030/test/dateIn/newMetrica',
                    view:   'http://localhost:3030/test/dateIn/ultimasTresMetricas',
                    mod:    'http://localhost:3030/test/dateIn/editMegrica',
                }
            },
            },

            usuarios:{
                sinLinks : ""
            },

        }

        res.json(links);
    },

}

module.exports = controlador;

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