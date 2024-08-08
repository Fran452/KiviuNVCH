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

function generarRecordatorio(fecha,tipo){
	switch (tipo) {
		case 1:
			fecha.setDate(fecha.getDate() + 7)
			return fecha
			break;
		
		case 2:
			fecha.setDate(fecha.getDate() + 15)
			return fecha
			break;
		
		case 3:
			fecha.setDate(fecha.getMonth() + 1)
			return fecha
			break;
		
		case 4:
			fecha.setDate(fecha.getMonth() + 3)
			return fecha
			break;
		
		default:
			return 1
			break;
	}
}

function asignarColor(fecha){
	const fechaActual = new Date();
	const fechaEnviada = new Date(fecha);
	let resultadoAño = fechaEnviada.getFullYear() - fechaActual.getFullYear() ; 
	let resultadoMes = fechaEnviada.getMonth() - fechaActual.getMonth();
	let resultadoDia = fechaEnviada.getDate() - fechaActual.getDate();
	
	if(resultadoAño < 0 || resultadoMes < 0 || resultadoDia < 0 ){
		return "rojo"
	}else if(resultadoAño == 2 || resultadoMes == 2 || resultadoDia < 2){
		return "Azul"
	}else{	
		return "Verde"
	}
}
module.exports = {archivoJSON, subirArchivo, crearID,armadoCodigoDeError,generarRecordatorio,asignarColor}

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