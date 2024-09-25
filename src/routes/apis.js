const express = require("express");
const apisHome = require('../apis/controllerHomeApis');
const apisUser = require('../apis/controllerUserApis');
const apisPlanDeAccion = require('../apis/controllerPlanDeAccionApis');
const apisDateIn = require('../apis/controllerDateInApis');
const homeController = require("../controllers/controller");

const router = express.Router();

router.get('/index',apisHome.index);

router.post('/bi',apisHome.bi);

router.post('/plan-accion/viewCiclos',apisPlanDeAccion.viewCiclos);
router.post('/plan-accion/addCiclos',apisPlanDeAccion.addCiclos);
router.put('/plan-accion/modCiclos',apisPlanDeAccion.modCiclos);
router.put('/plan-accion/deleteCiclos',apisPlanDeAccion.deleteCiclos);

router.post('/plan-accion/viewProceso',apisPlanDeAccion.viewProceso);
router.post('/plan-accion/addProceso',apisPlanDeAccion.addProceso);
router.put('/plan-accion/modProceso',apisPlanDeAccion.modProceso);
router.put('/plan-accion/deleteProceso',apisPlanDeAccion.deleteProceso);

router.post('/plan-accion/viewTask',apisPlanDeAccion.viewTareas);
router.post('/plan-accion/addTask',apisPlanDeAccion.addTarea);
router.put('/plan-accion/modTask',apisPlanDeAccion.modTarea);
router.put('/plan-accion/deleteTask',apisPlanDeAccion.deleteTarea);

router.post('/plan-accion/viewSubTask',apisPlanDeAccion.viewSubTarea);
router.post('/plan-accion/addSubTask',apisPlanDeAccion.addSubTarea);
router.put('/plan-accion/modSubTask',apisPlanDeAccion.modSubTarea);
router.put('/plan-accion/deleteSubTask',apisPlanDeAccion.deleteSubTarea);
router.put('/plan-accion/subTareaok',apisPlanDeAccion.terminarSubTarea);

router.post('/plan-accion/viewMuestras',apisPlanDeAccion.viewMuestras);
router.post('/plan-accion/addMuestras',apisPlanDeAccion.addMuestras);
router.put('/plan-accion/modMuestras',apisPlanDeAccion.modMuestras);
router.put('/plan-accion/deleteMuestras',apisPlanDeAccion.deleteMuestras);
router.put('/plan-accion/muestrasok',apisPlanDeAccion.terminarMuestras);

router.get('/plan-accion/metricas',apisPlanDeAccion.metricas);
router.post('/plan-accion/cargaExcel',apisPlanDeAccion.cargaDeExcel);

router.post('/login',apisUser.loginFuction);


router.post('/dateIn',apisDateIn.viewIndicadores);

router.post('/dateIn/newIndicador',apisDateIn.newindicador);
router.put('/dateIn/editIndicador',apisDateIn.editIndicadores);
router.put('/dateIn/deleteIndicador',apisDateIn.deleteIndicadores);

router.post('/dateIn/newMetrica',apisDateIn.newMetrica);
router.put('/dateIn/editMetrica',apisDateIn.editMetrica);
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




