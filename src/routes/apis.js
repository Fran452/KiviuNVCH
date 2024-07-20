const express = require("express");
const apisHome = require('../apis/controllerHomeApis');
const apisUser = require('../apis/controllerUserApis');
const apisPlanDeAccion = require('../apis/controllerPlanDeAccionApis');

const router = express.Router();

router.post('/index',apisHome.index);

router.post('/bi',apisHome.bi);


router.post('/plan-accion',apisPlanDeAccion.planesAcciónView);
router.post('/plan-accion/addTask',apisPlanDeAccion.addTarea);
router.post('/plan-accion/modTask',apisPlanDeAccion.modTarea);
router.post('/plan-accion/deleteTask',apisPlanDeAccion.deleteTarea);


router.post('/login',apisUser.loginFuction);

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
router.get('/',homeController.index);

module.exports = router




