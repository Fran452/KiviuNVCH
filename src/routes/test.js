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

router.get('/plan-accion/addProyect',testPlanesDeAccion.createProyecto);
router.get('/plan-accion/viewProyect',testPlanesDeAccion.readProyecto);
router.get('/plan-accion/modProyect',testPlanesDeAccion.editeProyecto);
router.get('/plan-accion/deleteProyect',testPlanesDeAccion.deleteProyecto);

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