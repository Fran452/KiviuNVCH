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

function armadoCodigoDeError(error){


	switch (error){
		case "ReferenceError":
			return 10;
		 break
		
		case "Error":
			return 15;
		 break

		case "SequelizeConnectionRefusedError":
			return 20;
		 break
		
		 default:
			return 99;
	}
}


module.exports = {archivoJSON, subirArchivo, crearID,armadoCodigoDeError}

/**
Codigos de error en SQL
00: sin error 
10: no se encontro el archivo
15: error en sintaxis
 

{
  "error": "ReferenceError",
  "errorDetalle": "resultado is not defined"
} ->  cuando no encuentra nada
{
error": "Error",
  "errorDetalle": "WHERE parameter \"mail\" has invalid \"undefined\" value"
} -> cuando el error es de sintaxis

{
  "error": "SequelizeConnectionRefusedError",
  "errorDetalle": "connect ECONNREFUSED 127.0.0.1:3306"
}-> error de coneccion
*/