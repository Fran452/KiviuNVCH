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

    crarAmbienteGenerico: async function () {
        let areas = [];
        let empleados = [];

        for(let i = 0;i<3;i++){
            let areaCrada = await this.crearArea(`nombre del area ${i}`,'sin Power Bi');
            
            for(let j = 0;j < 3 ; j++){
                let empleado = await this.crearUsuario(areaCrada.id_area,j,`Nombre del empelado ${j}`,'1234',`empleadoN${j}A${areaCrada.id_area}@kiviu.com`,'sin interes');
                empleados.push(empleado);
            }
            areas.push(areaCrada);
        };

        return {areas : areas, empleados : empleados};

    },

    eliminarAmbienteGenerico: async function (objeto) {
        for(let i = 0; i< objeto.empleados.length;i++){
            await this.eliminarUsuario(objeto.empleados[i].id_empleado);
        };

        for(let i = 0; i< objeto.areas.length;i++){
            await this.eliminarArea(objeto.areas[i].id_area);
        };
        
        
    },


    // Para proyectos
    crearProyecto: async function(area,nombre,detalle){
        let objetoCreado = await dataBaseSQL.proyectos.create({
            fk_area: area,
            nombre: nombre,
            detalles:detalle,
            ver:1
        });
        return objetoCreado.dataValues;
    },

    buscarProyecto: async function(id){
        let busqueda = await dataBaseSQL.proyectos.findOne({
            where: {
                id_proyecto : id
            },
            attributes: ['id_proyecto','fk_area','nombre','detalles','ver'],
            include: [
                {association : "Areas",attributes: ['id_area','nombre_del_Area']},
            ]
        });
        return busqueda.dataValues;
    },
    
    eliminarProyecto: async function(id){
        await dataBaseSQL.proyectos.destroy({
            where : {id_proyecto: id}
        });
    },

    // Para Tareas 
    crearTarea: async function(fk_empleado_asignado,fk_area,fk_area_apoyo,nombre,fk_proyecto,estado,prioridad,fecha_inicio,fecha_final,notas,progreso){
        let objetoCreado = await dataBaseSQL.tareas.create({
            fk_empleado_asignado,
            fk_area,
            fk_area_apoyo,
            fk_proyecto,
            nombre,
            estado,
            prioridad,
            fecha_inicio,
            fecha_final,
            notas,
            progreso,
            mostrar : 1,
        });
        return objetoCreado.dataValues;
    },

    buscarTarea: async function(id){
        let busqueda = await dataBaseSQL.tareas.findOne({
            where: {
                id_tarea : id
            },
            attributes: ['id_tarea','nombre','estado','prioridad','fecha_inicio','fecha_final','notas','progreso'],
            include: [
                {association : "Empleados",attributes: ['nombre','fk_area','fk_puesto','mail']},
                {association : "AreasApollo",attributes: ['id_area','nombre_del_Area']},
                {association : "Proyectos",attributes: ['id_proyecto','nombre']},
                {association : "Areas",attributes: ['id_area','nombre_del_Area']},                
            ]
        });
        return busqueda.dataValues;
    },
    
    eliminarTarea: async function(id){
        await dataBaseSQL.tareas.destroy({
            where : {id_tarea: id}
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

    crearUsuario: async function (area,puesto,nombre,contraseña,mail,sucursal) {
        let creacion = await dataBaseSQL.empleados.create({
            fk_area:    area,
            fk_Puesto:  puesto,
            nombre:     nombre,
            password:   contraseña,
            mail:       mail,
            sucursal:   sucursal
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