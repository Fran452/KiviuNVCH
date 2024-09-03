const dataBaseSQL = require("../databaseSQL/models");
const funcionesDeTest = require('./funcionesTestGenericas')

const path = require("path");

const bcrypt = require("bcrypt");
const funcionesGenericas = require("../funcionesGenerales");
const { planesAcción } = require("../controllers/controller");


const controlador = {
    
    testGenerico: async (req,res) => {
        let links = {
            ArmarBaseDeDatos:'http://localhost:3030/test/armado-SQL',
            planesAcción:{
                testGenericos: 'http://localhost:3030/test/plan-accion',
                ciclos:{
                    add:    'http://localhost:3030/test/plan-accion/addCiclos',
                    view:   'http://localhost:3030/test/plan-accion/viewCiclos',
                    mod:    'http://localhost:3030/test/plan-accion/modCiclos',
                    delete: 'http://localhost:3030/test/plan-accion/deleteCiclos'
                },
                tareas:{
                    add:    'http://localhost:3030/test/plan-accion/addTask',
                    view:   'http://localhost:3030/test/plan-accion/viewTareas',
                    mod:    'http://localhost:3030/test/plan-accion/modTask',
                    delete: 'http://localhost:3030/test/plan-accion/deleteTask'
                },
                subTarea:{
                    add:    'http://localhost:3030/test/plan-accion/addSubTask',    
                    view:   'http://localhost:3030/test/plan-accion/viewSubTask',
                    mod:    'http://localhost:3030/test/plan-accion/modSubTask',
                    delete: 'http://localhost:3030/test/plan-accion/deleteSubTask'
                },
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
            
            let area =  await funcionesDeTest.crearArea('Prestamos','sin powe By');
            
            let usuarioCreado = await funcionesDeTest.crearUsuario(area.id_area,1,"francisco Lema",'$2b$16$3LvhCzCPQm.eenIQkZGk/uT8fwtDE4QPsg1RzLhrKzM9HTrGhlpTq','FRAN','franciscolemacr@gmail.com');
            
            let usuario = {
                id: usuarioCreado.id_empleado,
                nombre:usuarioCreado.nombre,
                area:usuarioCreado.fk_area,
                puesto:usuarioCreado.fk_puesto,
                mail:usuarioCreado.mail  
            };

            let ciclo     = await funcionesDeTest.crearCiclo(usuario.area,"Ciclo Préstamos","Ciclo de prestamos primera revicion",fechaInicial,fechaFin,1);
            
            let tarea     = await funcionesDeTest.crearTarea(usuario.id,usuario.area,ciclo.id_ciclo,"Préstamos Consumo y Comercial 1° revisión",1,1,"notas",0,0);
            let subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Relevamiento",usuario.id,20,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
            subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Matriz de Riesgos y Controles",usuario.id,2,0,1,1,fechaInicial,fechaFin,"esto son notas",1);



            tarea     = await funcionesDeTest.crearTarea(usuario.id,usuario.area,ciclo.id_ciclo,"Normativa",1,1,"notas",0,0);
            subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Normativa Consumo ",usuario.id,2,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
            subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Normativa Comercial",usuario.id,2,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
            subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Organigrama",usuario.id,2,0,1,1,fechaInicial,fechaFin,"esto son notas",1);


            tarea     = await funcionesDeTest.crearTarea(usuario.id,usuario.area,ciclo.id_ciclo,"Cruces Contables con RI e Inventario",1,1,"notas",0,0);
            subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Tarea realizada - Cruces RI, Invetarios y Contabilidad",usuario.id,1,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
            subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Cruce RI con Saldos Contables",usuario.id,2,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
            subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Cruce RI con Inventarios",usuario.id,6,0,1,1,fechaInicial,fechaFin,"esto son notas",1);


            tarea     = await funcionesDeTest.crearTarea(usuario.id,usuario.area,ciclo.id_ciclo,"Procedimientos Cartera Consumo",1,1,"notas",0,0);
            subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"TR Consumo",usuario.id,1,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
            subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Muestra Consumo",usuario.id,3,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
            subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Análisis Consumo",usuario.id,160,0,1,1,fechaInicial,fechaFin,"esto son notas",1);


            ciclo   =   await funcionesDeTest.crearCiclo(usuario.area,"Procedimientos Cartera Comercial","Procedimientos Cartera Comercial",fechaInicial,fechaFin,1);
            
            tarea     = await funcionesDeTest.crearTarea(usuario.id,usuario.area,ciclo.id_ciclo,"Cartera Comercial Clasificación y Previsionamiento",1,1,"notas",0,0);
            subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"TR Consumo",usuario.id,1,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
            subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Muestra Consumo",usuario.id,4,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
            subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Análisis Consumo",usuario.id,248,0,1,1,fechaInicial,fechaFin,"esto son notas",1);

            tarea     = await funcionesDeTest.crearTarea(usuario.id,usuario.area,ciclo.id_ciclo,"Cartera Comercial y Asimilable",1,1,"notas",0,0);
            subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"TR Cartera Comercial y Asimilable",usuario.id,1,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
            subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Muestra Altas Líneas Comerciales",usuario.id,4,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
            subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Alta de Líneas Nuevas",usuario.id,2,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
            subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Análisis Altas Líneas Comerciales",usuario.id,164,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
            
            tarea     = await funcionesDeTest.crearTarea(usuario.id,usuario.area,ciclo.id_ciclo,"Comité de Crédito",1,1,"notas",0,0);
            subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"TR Comité de Crédito",usuario.id,2,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
            subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Análisis Comité de Crédito",usuario.id,2,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
            subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Resumen Comité de Crédito",usuario.id,6,0,1,1,fechaInicial,fechaFin,"esto son notas",1);


            tarea     = await funcionesDeTest.crearTarea(usuario.id,usuario.area,ciclo.id_ciclo,"Regimen Informativo",1,1,"notas",0,0);
            subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"TR Verificación de Régimen Informativo",usuario.id,1,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
            subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Validaciones RI Deudores por NOP y BCRA",usuario.id,2,0,1,1,fechaInicial,fechaFin,"esto son notas",1);
            subtarea  = await funcionesDeTest.crearSubTarea(tarea.id_tarea,"Controles Entidad sobre RI Deudores",usuario.id,2,0,1,1,fechaInicial,fechaFin,"esto son notas",1);

            tarea     = await funcionesDeTest.crearTarea(usuario.id,usuario.area,ciclo.id_ciclo,"Evidencia de Monitoreo",1,1,"notas",0,0);
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