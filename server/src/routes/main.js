const express = require("express");
const homeController = require("../controllers/controller.js");

const router = express.Router();

router.get('/home',homeController.index);

router.post('/bi/:area',homeController.bi);

router.get('/plan-accion-config',homeController.planesAcción);
router.post('/plan-accion-config',homeController.planesAcciónFuction);

router.get('/plan-accion',homeController.planesAcciónView);
router.get('/plan-accion/agregarTarea',homeController.agregarTarea);

router.get('/datIN',homeController.datInView);
router.post('/datIN',homeController.datINFuction);

router.get('/asistente-Ia',homeController.asistenteIa);

router.get('/okr',homeController.okr);

router.get('/login',homeController.login);
router.post('/login',homeController.loginFuction);

//router.get('/register',homeController.registerView)
//router.post('/register',homeController.registerFuction)

router.get('/test',homeController.test);

router.get('/',homeController.test);

module.exports = router




