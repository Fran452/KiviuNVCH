const express       = require("express");
const multer        = require ("multer");
const path          = require('path');

const apisUser          = require('../../apis/controllerUserApis');

const router = express.Router();

router.post('/',apisUser.totalUser);
router.post('/viewUser',apisUser.totalUser);
router.post('/login',apisUser.loginFuction);
router.post('/registerUser',apisUser.registerFuction);
router.post('/deleteUser',apisUser.deleteEmpleado);



module.exports = router




