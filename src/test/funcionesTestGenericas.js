const dataBaseSQL = require("../databaseSQL/models");
let controlador = {
    // General
    crearTest: function(objetoTest,nombreTest,esperado,recibido,condicion){
        var keyTest = `test${0}`        
        for(let numeroDeTest = 0;objetoTest[keyTest] != undefined;numeroDeTest++){
           keyTest = `test${numeroDeTest}` 
        }

        switch (condicion) {
            case 1:
                if(recibido == esperado){
                    objetoTest[keyTest] = {
                        descripcion : nombreTest,
                        estado      : "Correcto"
                    }
                }else{
                    objetoTest[keyTest] = {
                        descripcion : nombreTest,
                        estado      : "Error",
                        esperado    : esperado,
                        recibido    : recibido
                    }
                }
                break;
            
            case 2:
                if(recibido > esperado){
                    objetoTest[keyTest] = {
                        descripcion : nombreTest,
                        estado      : "Correcto"
                    }
                }else{
                    objetoTest[keyTest] = {
                        descripcion : nombreTest,
                        estado      : "Error",
                        esperado    : esperado,
                        recibido    : recibido
                    }
                }
                break;
            
            case 3:
                if(recibido < esperado){
                    objetoTest[keyTest] = {
                        descripcion : nombreTest,
                        estado      : "Correcto"
                    }
                }else{
                    objetoTest[keyTest] = {
                        descripcion : nombreTest,
                        estado      : "Error",
                        esperado    : esperado,
                        recibido    : recibido
                    }
                }
                break;
            
            case 4:

                if(recibido != esperado){
                    objetoTest[keyTest] = {
                        descripcion  : nombreTest,
                        estado       : "Correcto"
                    }
                }else{
                    objetoTest[keyTest] = {
                        descripcion : nombreTest,
                        estado      : "Error",
                        esperado    : esperado,
                        recibido    : recibido
                    }
                }
                break;
            
            default:
                if(condicion){
                    objetoTest[keyTest] = {
                        descripcion : nombreTest,
                        estado      : "Correcto"
                    }
                }else{
                    objetoTest[keyTest] = {
                        descripcion : nombreTest,
                        estado      : "Error",
                        esperado    : esperado,
                        recibido    : recibido
                    }
                }
                break;
                
        }
        console.log(objetoTest);
        return objetoTest;

    },

    crearTestCorrecto: function (objetoTest,nombreTest){
        var keyTest = `test${0}`        
        for(let numeroDeTest = 0;objetoTest[keyTest] != undefined;numeroDeTest++){
           keyTest = `test${numeroDeTest}` 
        }
        objetoTest[keyTest] = {
            descripcion : nombreTest,
            estado : "Correcto"
        }
        return objetoTest;
    },

    crearTestError: function (nombreTest,objetoTest,esperado,recibido){
        var keyTest = `test${0}`        
        for(let numeroDeTest = 0;objetoTest[keyTest] != undefined;numeroDeTest++){
           keyTest = `test${numeroDeTest}` 
        }

        objetoTest[keyTest] = {
            descripcion : nombreTest,
            estado : "Error",
            esperado: esperado,
            recibido,recibido
        }
        console.log(objetoTest);
        return objetoTest;
    },

    // Para indicadores
    crearIndicador : async function(fk_area,fk_responsable,fk_responsable_suplente,nombre_indicador,detalles_metrica,tipo_recordartorio,fecha_del_recodatorio){
        let indicador = await dataBaseSQL.indicadores.create({
            fk_area : fk_area,
            fk_responsable : fk_responsable,
            fk_responsable_suplente : fk_responsable_suplente,
            nombre_indicador : nombre_indicador,
            detalles_metrica : detalles_metrica,
            tipo_recordartorio : tipo_recordartorio,
            fecha_del_recodatorio : fecha_del_recodatorio,
            mostrar:1
        });
        return indicador.dataValues;
    },
    
    buscarIndicadorEjemplo : async function(id) {
        let busqueda = await dataBaseSQL.indicadores.findOne({
            where: {
                id_indicador : id
            },
            attributes: ['id_indicador','nombre_indicador','detalles_metrica','tipo_recordartorio',"mostrar",'fecha_del_recodatorio'],
            include: [
                {association : "Areas",attributes: ['id_area','nombre_del_Area']},
                {association : "Empleados",attributes: ['nombre','mail']},
                {association : "ResponsableSuplente",attributes: ['nombre','mail']}
            ]
        });
        return busqueda.dataValues;
    },

    eliminarIndicadorEjemplo: async function(id) {
        await dataBaseSQL.indicadores.destroy({
            where : {id_indicador: id}
        });
    },
    
    
    // Para metricas
    buscarMetricaEjemplo: async function(id) {
        let metrica = await dataBaseSQL.metricas.findAll({
            where: {
                id_metrica : id
            },
            include: [{association : "Empleados",attributes: ['nombre','mail']}]
        });
        let busqueda = metrica.find(metrica => metrica.id_metrica == id);
        return busqueda;
    },

    crearMetrica: async function (fk_indicador,dato_metrica,fecha_Metrica,log_de_usuario) {
        let metrica = await dataBaseSQL.metricas.create({
            fk_indicador:   fk_indicador,
            dato_metrica:   dato_metrica,
            fecha_Metrica:  fecha_Metrica,
            log_de_usuario: log_de_usuario
        });
        return metrica.dataValues;
    },

    eliminarMetricaEjemplo: async function (id) {
        await dataBaseSQL.metricas.destroy({
            where : {id_metrica: id}
        });
    
    },
}




module.exports = controlador;