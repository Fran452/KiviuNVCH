const fs = require("fs");
const path = require("path");
const logs = path.join(__dirname,"logs.txt");

function archivoJSON(direccion){
    return JSON.parse(fs.readFileSync(direccion, 'utf-8'));
}

function subirArchivo(direccion,objeto){
	let baseDeDatos = archivoJSON(direccion);
	baseDeDatos.push(objeto);
	fs.writeFileSync(direccion,JSON.stringify(baseDeDatos,null,2));
}

function crearID(array){
	return array[array.length - 1].id + 1
}

module.exports = {archivoJSON, subirArchivo, crearID}