/*
CREATE TABLE Tareas (
    id_tarea                                INT PRIMARY KEY AUTO_INCREMENT,
    fk_empleado_asignado                    INT NOT NULL,
    fk_area                                 INT NOT NULL,
--  fk_area_apoyo                           INT NOT NULL,
    fk_procesos                             INT NOT NULL,
    nombre                                  VARCHAR(255) NOT NULL,
    estado	                                INT, -- de no ser agregado se le asigna 1
    prioridad					            INT NOT NULL,  -- default 2
--  fecha_inicio                            DATE NOT NULL,
    fecha_final                             DATE NOT NULL, -- 31/12/ actual año
    notas                                   VARCHAR(255),
    progreso					            INT,            -- 0
    horas_totales                           INT NOT NULL,  -- 0
    ver                                     INT NOT NULL, 
    FOREIGN KEY (fk_empleado_asignado)      REFERENCES Empleados(id_empleado),
--  FOREIGN KEY (fk_area_apoyo)             REFERENCES Areas(id_area),
    FOREIGN KEY (fk_procesos)               REFERENCES Procesos(id_procesos),
    FOREIGN KEY (fk_area)                   REFERENCES Areas(id_area)
);
*/
module.exports = (sequelize,DataTypes) => {

    let nombre = "tareas";
    
    let columnas = {
        
        "id_tarea": {
            type:DataTypes.INTEGER(),
            primaryKey: true,
            autoIncrement: true,
        },

        "fk_empleado_asignado": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "fk_area": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },

/*        "fk_area_apoyo": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },
*/
        "fk_ciclo": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },
        
        "nombre":{
            type: DataTypes.STRING(255),
            defaultValue: " "
        },
        
        "estado": {
            type:DataTypes.INTEGER(),
            allowNull: false,
            defaultValue: 0
        },
/*
        "prioridad": {
            type:DataTypes.INTEGER(),
            allowNull: false,
            defaultValue: 0
        },
        
        "progreso": {
            type:DataTypes.INTEGER(),
            allowNull: false,
            defaultValue: 0
        },
        
       "fecha_inicio":{
            type: DataTypes.DATE(255),
            allowNull: false
        },

        "fecha_final":{
            type: DataTypes.DATE(255),
            allowNull: false
        },

*/       
        "notas":{
            type: DataTypes.STRING(255),
            defaultValue: ' '
        },

        "ver": {
            type:DataTypes.INTEGER(),
            allowNull: false,
            defaultValue: 1
        },

    };

    let config =  {
        timestamps: false,
        tableName : "Tareas"
    };

    const tareas = sequelize.define(nombre,columnas,config);

    tareas.associate = (models) => {

        /* Union con Empleados */
        tareas.belongsTo(models.empleados,{
            foreignKey : 'fk_empleado_asignado',
            as: 'Empleado'
        });

        /* Union con Areas */
        tareas.belongsTo(models.areas,{
            foreignKey : 'fk_area',
            as : 'Areas'
        });
/*
        tareas.belongsTo(models.areas,{
            foreignKey : 'fk_area_apoyo',
            as : 'AreasApollo'
        });
*/
        /* Union con Procesos */
        tareas.belongsTo(models.ciclos,{
            foreignKey : 'fk_ciclo',
            as : 'Ciclo'
        });

        
        tareas.hasMany(models.subtareas,{
            foreignKey : 'fk_tareas',
            as : 'Subtareas'
        });
    }

    return tareas;

};