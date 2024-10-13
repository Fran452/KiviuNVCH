const express = require("express");

const router = express.Router();
const testPlanesDeAccion = require("../test/testPlanesDeAccion");
const testIndex = require('../test/testIndex');

/*



router.post('/bi',apisHome.bi);
router.post('/login',apisUser.loginFuction);

*/



router.get('/',testIndex.testGenerico);
router.get('/armado-SQL',testIndex.crearBaseDeDatos);
router.get('/armado-Empleados',testIndex.crearBaseDeDatosEmpleados);

router.get('/plan-accion',testPlanesDeAccion.testGenerico);

router.get('/plan-accion/viewCiclos',testPlanesDeAccion.verCiclos);
router.get('/plan-accion/addCiclos',testPlanesDeAccion.crearCiclo);
router.get('/plan-accion/modCiclos',testPlanesDeAccion.editarCiclos);
router.get('/plan-accion/deleteCiclos',testPlanesDeAccion.eliminarCiclos);

router.get('/plan-accion/addTask',testPlanesDeAccion.createTarea);
router.get('/plan-accion/viewTareas',testPlanesDeAccion.readTarea);
router.get('/plan-accion/modTask',testPlanesDeAccion.editeTarea);
router.get('/plan-accion/deleteTask',testPlanesDeAccion.deleteTarea);

router.get('/plan-accion/viewSubTask',testPlanesDeAccion.viewSubTarea);
router.get('/plan-accion/addSubTask',testPlanesDeAccion.addSubTarea);
router.get('/plan-accion/modSubTask',testPlanesDeAccion.editSubTarea);
router.get('/plan-accion/deleteSubTask',testPlanesDeAccion.deleteSubTarea);


router.get('/plan-accion/otros',testPlanesDeAccion.pruebasPreImplementacion);

module.exports = router