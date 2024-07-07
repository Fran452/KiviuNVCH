const express = require("express");
const homeController = require("../controllers/controller");

const router = express.Router();



router.get('/home',homeController.index);

router.get('/bi/:area',homeController.bi);

router.get('/plan-accion-config',homeController.planesAcción);
router.post('/plan-accion-config',homeController.planesAcciónFuction);

router.get('/plan-accion',homeController.planesAcciónView);

router.get('/okr',homeController.okrView);
router.post('/okr',homeController.okrFuction);

router.get('/asistente-Ia',homeController.asistenteIa);

router.get('/datIN',homeController.datIN);

router.get('/login',homeController.login);
router.post('/login',homeController.loginFuction);

router.get('/register',homeController.registerView)
router.post('/register',homeController.registerFuction)

router.get('/',homeController.index);

module.exports = router




