const express = require("express");

const router = express.Router();
const testDateIn = require("../test/testDateIn");

/*router.get('/',testController.testGenerico);



router.post('/bi',apisHome.bi);


router.post('/plan-accion',apisPlanDeAccion.viewTareas);
router.post('/plan-accion/addTask',apisPlanDeAccion.addTarea);
router.put('/plan-accion/modTask',apisPlanDeAccion.modTarea);
router.put('/plan-accion/deleteTask',apisPlanDeAccion.deleteTarea);

router.post('/plan-accion/viewProyect',apisPlanDeAccion.viewProyecto);
router.post('/plan-accion/addProyect',apisPlanDeAccion.addProyecto);
router.put('/plan-accion/modProyect',apisPlanDeAccion.modProyecto);
router.put('/plan-accion/deleteProyect',apisPlanDeAccion.deleteProyecto);

router.post('/login',apisUser.loginFuction);

*/
router.get('/dateIn',testDateIn.testGenerico);

router.get('/dateIn/viewIndicador',testDateIn.viewIndicadores);
router.get('/dateIn/newIndicador',testDateIn.newindicador);
router.get('/dateIn/editIndicador',testDateIn.editIndicadores);
router.get('/dateIn/deleteIndicador',testDateIn.deleteIndicadores);

router.get('/dateIn/newMetrica',testDateIn.newMetrica);
router.get('/dateIn/editMegrica',testDateIn.editMetrica);
router.get('/dateIn/ultimasTresMetricas',testDateIn.ultimasTresMetricas);

module.exports = router