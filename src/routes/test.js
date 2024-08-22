const express = require("express");

const router = express.Router();
const testDateIn = require("../test/testDateIn");
const testPlanesDeAccion = require("../test/testPlanesDeAccion");
const testIndex = require('../test/testIndex');

/*



router.post('/bi',apisHome.bi);
router.post('/login',apisUser.loginFuction);

*/


router.get('/',testIndex.testGenerico);


router.get('/plan-accion',testPlanesDeAccion.testGenerico);

router.get('/plan-accion/viewCiclos',testPlanesDeAccion.verCiclos);
router.get('/plan-accion/addCiclos',testPlanesDeAccion.crearCiclo);
router.get('/plan-accion/modCiclos',testPlanesDeAccion.editarCiclos);
router.get('/plan-accion/deleteCiclos',testPlanesDeAccion.eliminarCiclos);

router.get('/plan-accion/viewProcesos',testPlanesDeAccion.readProceso);
router.get('/plan-accion/addProceso',testPlanesDeAccion.createProceso);
router.get('/plan-accion/modProceso',testPlanesDeAccion.editeProceso);
router.get('/plan-accion/deleteProceso',testPlanesDeAccion.deleteProceso);

router.get('/plan-accion/addTask',testPlanesDeAccion.createTarea);
router.get('/plan-accion/viewTareas',testPlanesDeAccion.readTarea);
router.get('/plan-accion/modTask',testPlanesDeAccion.editeTarea);
router.get('/plan-accion/deleteTask',testPlanesDeAccion.deleteTarea);



router.get('/dateIn',testDateIn.testGenerico);

router.get('/dateIn/viewIndicador',testDateIn.viewIndicadores);
router.get('/dateIn/newIndicador',testDateIn.newindicador);
router.get('/dateIn/editIndicador',testDateIn.editIndicadores);
router.get('/dateIn/deleteIndicador',testDateIn.deleteIndicadores);

router.get('/dateIn/newMetrica',testDateIn.newMetrica);
router.get('/dateIn/editMegrica',testDateIn.editMetrica);
router.get('/dateIn/ultimasTresMetricas',testDateIn.ultimasTresMetricas);

module.exports = router