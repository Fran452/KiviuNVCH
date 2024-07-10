const dataBaseSQL = require("../databaseSQL/models");
const path = require("path");

const baseDeDatos = {
    empleados : path.join(__dirname, "../database/db_user.json"),
    area      : path.join(__dirname, "../database/db_areas.json"),
    tareas    : path.join(__dirname, "../database/db_tareas.json"),
    view      : path.join(__dirname, "../database/db_view.json"),
    okr       : path.join(__dirname, "../database/db_okrs.json")
}

const funcionesGenericas = require("../funcionesGenerales");

const controlador = {

    agregarTarea:  async (req,res)  => { },  

    modificarTarea: async (req,res) => { },  

    eliminarTarea: async (req,res)  => { },  

    mostrarTareas: async (req,res)  => { }

}

module.exports = controlador;