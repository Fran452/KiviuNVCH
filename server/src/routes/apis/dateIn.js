const express       = require("express");

const apisDateIn    = require('../../apis/controllerDateInApis');


const router = express.Router();

router.post('/dateIn',apisDateIn.viewIndicadores);

router.post('/newIndicador',apisDateIn.newindicador);
router.put('/editIndicador',apisDateIn.editIndicadores);
router.put('/deleteIndicador',apisDateIn.deleteIndicadores);

router.post('/newMetrica',apisDateIn.newMetrica);
router.put('/editMetrica',apisDateIn.editMetrica);
router.post('/ultimas3Metricas',apisDateIn.ultimasTresMetricas);

module.exports = router




