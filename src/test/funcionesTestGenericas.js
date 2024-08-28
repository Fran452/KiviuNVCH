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
        return objetoTest;
    },

/**
 * 
 * @returns array
 * {
 *   area : datos de area,
 *   empleados : [empleados]
 * }
 */
    crarAmbienteGenerico: async function () {
        let baseDeDatos = [];
        
        for(let i = 0;i<3;i++){
            let puesto = 1
            let objeto = {}
            let areaCrada = await this.crearArea(`nombre del area ${i}`,'sin Power Bi');
            let empleados = []
            for(let j = 0;j < 3 ; j++){
                let empleado = await this.crearUsuario(areaCrada.id_area,puesto,`Nombre del empelado ${j}`,'1234','',`empleadoN${j}A${areaCrada.id_area}@kiviu.com`);
                puesto++;
                empleados.push(empleado); 
            }

            objeto = {
                area : areaCrada,
                empleados : empleados
            }

            baseDeDatos.push(objeto);
        };
        return baseDeDatos;

    },

    eliminarAmbienteGenerico: async function (objeto) {
        
        for(let i = 0; i < objeto.length;i++){
            for(let j = 0; j < objeto[i].empleados.length;j++){
                await this.eliminarUsuario(objeto[i].empleados[j].id_empleado);
            };
            await this.eliminarArea(objeto[i].area.id_area);
        };
        
        
    },

    //* Para Ciclo
    crearCiclo: async function(area,nombre,detalle,fecha_inicio,fecha_final,ver){
        let objetoCreado = await dataBaseSQL.ciclos.create({
            fk_area     : area,
            nombre      : nombre,
            detalles    : detalle,
            fecha_inicio: fecha_inicio,
            fecha_final : fecha_final,
            ver         : ver
        });
        return objetoCreado.dataValues;
    },
    
    buscarCiclo: async function(id){
        let busqueda = await dataBaseSQL.ciclos.findOne({
            where: {
                id_ciclo : id
            },
            include: [
                {association : "Areas",attributes: ['id_area','nombre_del_Area']},
            ]
        });
        return busqueda.dataValues;
    },
    
    eliminarCiclo: async function(id){
        await dataBaseSQL.ciclos.destroy({
            where : {id_ciclo: id}
        });
    },

    //! Futura eliminacion 
    // Para proceso
    crearProceso: async function(area,ciclo,nombre,detalle,ver){
        let objetoCreado = await dataBaseSQL.procesos.create({
            fk_area:    area,
            fk_ciclo:   ciclo,
            nombre:     nombre,
            detalles:   detalle,
            ver:        ver
        });
        return objetoCreado.dataValues;
    },
    
    buscarProceso: async function(id){
        let busqueda = await dataBaseSQL.procesos.findOne({
            where: {
                id_procesos : id
            },
            include: [
                {association : "Areas",attributes: ['id_area','nombre_del_Area']},
                {association : "Ciclos",attributes: ['id_ciclo','nombre']},
            ]
        });
        return busqueda.dataValues;
    },
    
    eliminarProceso: async function(id){
        await dataBaseSQL.procesos.destroy({
            where : {id_procesos: id}
        });
    },

    //* Para Tareas 
    crearTarea: async function(fk_empleado_asignado,fk_area,fk_ciclos,nombre,estado,prioridad,fecha_final,notas,progreso,horas_totales){
        let objetoCreado = await dataBaseSQL.tareas.create({
            fk_empleado_asignado,
            fk_area,
            fk_ciclos,
            nombre,
            estado,
            prioridad,
            fecha_final,
            notas,
            progreso,
            horas_totales,
            ver : 1,
        });
        return objetoCreado.dataValues;
    },

    buscarTarea: async function(id){
        let busqueda = await dataBaseSQL.tareas.findOne({
            where: {
                id_tarea : id
            },
            attributes: ['id_tarea','nombre','estado','prioridad','notas','progreso','horas_totales'],
            include: [
                {association : "Empleado",attributes: ['nombre','fk_area','fk_puesto','mail']},
                {association : "Ciclo",attributes: ['id_ciclo','nombre']},
                {association : "Areas",attributes: ['id_area','nombre_del_Area']},                
            ]
        });
        return busqueda.dataValues;
    },
    
    buscarTareaConSubTareas: async function(id){
        let busqueda = await dataBaseSQL.tareas.findOne({
            where: {
                id_tarea : id
            },
            attributes: ['id_tarea','nombre','estado','prioridad','notas','progreso','horas_totales'],
            include: [
                {association : "Subtareas",attributes: ['id_sub_tarea','horasAprox','titulo']},
            ]
        });
        return busqueda.dataValues;
    },

    eliminarTarea: async function(id){
        await dataBaseSQL.tareas.destroy({
            where : {id_tarea: id}
        });
    },

    //* Para sub tareas
    crearSubTarea: async function(fk_tareas, titulo, asignacion, horasAprox, avance, estado, prioridad, notas, ver){
        let objetoCreado = await dataBaseSQL.subtareas.create({
            fk_tareas,
            titulo,
            asignacion,
            horasAprox,
            avance,
            estado,
            prioridad,
            notas,
            ver
        });
        return objetoCreado.dataValues;
    },

    buscarSubTarea: async function(id){
        let busqueda = await dataBaseSQL.subtareas.findOne({
            where: {
                id_sub_tarea : id
            },
            include: [
                {association : "Tareas",attributes: ['id_tarea','nombre','horas_totales']}, 
                {association : "Empleados",attributes: ['id_empleado', 'nombre','mail']},          
            ]
        });
        return busqueda.dataValues;
    },

    eliminarSubTareas: async function(id){
        await dataBaseSQL.subtareas.destroy({
            where : {id_sub_tarea: id},
            
        });
    },

    // Para indicadores
    crearIndicador: async function(fk_area,fk_responsable,fk_responsable_suplente,nombre_indicador,detalles_metrica,tipo_recordartorio,fecha_del_recodatorio){
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

    // Para usuarios
    buscarUsuario: async function(id) {
        busqueda = await dataBaseSQL.empleados.findOne(
            {
                where: {
                    id_empleado : id
                },
                include: [{association : "Areas"},{association : "Puestos"}]
            }
        );
        return busqueda;
    },

    buscarUsuarioPorMail: async function(mail) {
        busqueda = await dataBaseSQL.empleados.findOne(
            {
                where: {
                    mail : mail
                },
                include: [{association : "Areas"},{association : "Puestos"}]
            }
        );
        return busqueda;
    },
    
    crearUsuario: async function (area,puesto,nombre,contraseña,abreviatura,mail) {
        let creacion = await dataBaseSQL.empleados.create({
            fk_area:    area,
            fk_Puesto:  puesto,
            nombre:     nombre,
            password:   contraseña,
            mail:       mail,
            abreviatura: abreviatura
        });
        return creacion.dataValues;
    },

    eliminarUsuario: async function (id) {
        await dataBaseSQL.empleados.destroy({
            where : {id_empleado : id}
        });
    },

    // Para Areas
    buscarArea: async function(id) {
        busqueda = await dataBaseSQL.areas.findOne(
            {
                where: {
                    id_area : id
                },
            }
        );
        return busqueda;
    },

    crearArea: async function (nombre,power_Bi) {
        let metrica = await dataBaseSQL.areas.create({
            power_Bi:           power_Bi,
            nombre_del_Area:    nombre,
        });

        return metrica.dataValues;
    },

    eliminarArea: async function (id) {
        await dataBaseSQL.areas.destroy({
            where : {id_area: id}
        });
    
    },
    
}




module.exports = controlador;