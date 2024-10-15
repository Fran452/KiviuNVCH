const express       = require("express");

const user  = require("./apis/userApis");
const planesDeAccion = require("./apis/planesDeAccion");
const dateIn = require("./apis/dateIn");
const index = require("./apis/indexApis");

const router = express.Router();

router.use('/index',index);
router.use('/user',user);
router.use('/plan-accion',planesDeAccion);
router.use('/dateIn',dateIn);

module.exports = router




