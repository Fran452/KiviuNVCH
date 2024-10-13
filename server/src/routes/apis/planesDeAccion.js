const express       = require("express");
const multer        = require ("multer");
const path          = require('path');

const apisPlanDeAccion  = require('../../apis/controllerPlanDeAccionApis');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve (__dirname,"../excel"))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,'muestras.xlsx');
    }
  })

const upload = multer({storage});

router.post('/viewCiclos',apisPlanDeAccion.viewCiclos);
router.post('/addCiclos',apisPlanDeAccion.addCiclos);
router.put('/modCiclos',apisPlanDeAccion.modCiclos);
router.put('/deleteCiclos',apisPlanDeAccion.deleteCiclos);

router.post('/viewTask',apisPlanDeAccion.viewTareas);
router.post('/addTask',apisPlanDeAccion.addTarea);
router.put('/modTask',apisPlanDeAccion.modTarea);
router.put('/deleteTask',apisPlanDeAccion.deleteTarea);
router.put('/moveTask',apisPlanDeAccion.moveTarea);

router.post('/viewSubTask',apisPlanDeAccion.viewSubTarea);
router.post('/addSubTask',apisPlanDeAccion.addSubTarea);
router.put('/modSubTask',apisPlanDeAccion.modSubTarea);
router.put('/deleteSubTask',apisPlanDeAccion.deleteSubTarea);
router.put('/subTareaok',apisPlanDeAccion.terminarSubTarea);

router.post('/viewMuestras',apisPlanDeAccion.viewMuestras);
router.post('/addMuestras',apisPlanDeAccion.addMuestras);
router.put('/modMuestras',apisPlanDeAccion.modMuestras);
router.put('/deleteMuestras',apisPlanDeAccion.deleteMuestras);
router.put('/muestrasok',apisPlanDeAccion.terminarMuestras);

router.get('/metricas',apisPlanDeAccion.metricas);
router.post('/subitExcel',upload.single('excel'),apisPlanDeAccion.subirExcel);
router.post('/cargaExcel',apisPlanDeAccion.cargaDeExcel);


module.exports = router





