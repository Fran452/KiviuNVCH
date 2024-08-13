const express = require("express");
const apisHome = require('../apis/controllerHomeApis');
const apisUser = require('../apis/controllerUserApis');
const apisPlanDeAccion = require('../apis/controllerPlanDeAccionApis');
const apisDateIn = require('../apis/controllerDateInApis');
const homeController = require("../controllers/controller");

const router = express.Router();

router.get('/index',apisHome.index);

router.post('/bi',apisHome.bi);


router.post('/plan-accion/viewProyect',apisPlanDeAccion.viewProyecto);
router.post('/plan-accion/addProyect',apisPlanDeAccion.addProyecto);
router.post('/plan-accion/modProyect',apisPlanDeAccion.modProyecto);
router.post('/plan-accion/deleteProyect',apisPlanDeAccion.deleteProyecto);

router.post('/plan-accion',apisPlanDeAccion.viewTareas);
router.post('/plan-accion/addTask',apisPlanDeAccion.addTarea);
router.post('/plan-accion/modTask',apisPlanDeAccion.modTarea);
router.post('/plan-accion/deleteTask',apisPlanDeAccion.deleteTarea);


router.post('/login',apisUser.loginFuction);


router.post('/dateIn',apisDateIn.viewIndicadores);

router.post('/dateIn/newIndicador',apisDateIn.newindicador);
router.post('/dateIn/editIndicador',apisDateIn.editIndicadores);
router.post('/dateIn/deleteIndicador',apisDateIn.deleteIndicadores);

router.post('/dateIn/newMetrica',apisDateIn.newMetrica);
router.post('/dateIn/editMegrica',apisDateIn.editMetrica);
router.post('/dateIn/ultimas3Metricas',apisDateIn.ultimasTresMetricas);
/*

router.get('/plan-accion-config',homeController.planesAcción);
router.post('/plan-accion-config',homeController.planesAcciónFuction);

router.get('/apis/datIN',homeController.datInView);
router.post('/apis/datIN',homeController.datINFuction);

router.get('/apis/asistente-Ia',homeController.asistenteIa);

router.get('/apis/okr',homeController.okr);

router.get('/register',homeController.registerView)
router.post('/register',homeController.registerFuction)

*/
module.exports = router




