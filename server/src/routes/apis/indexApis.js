const express       = require("express");

const apisIndex          = require('../../apis/controllerHomeApis');

const router = express.Router();

router.post('/',apisIndex.index);
router.post('/viewAreas',apisIndex.index);
router.post('/powerBi',apisIndex.bi);



module.exports = router




