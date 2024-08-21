/*
CREATE TABLE Tareas (
    id_tarea                                INT PRIMARY KEY IDENTITY(1,1),
    fk_empleado_asignado                    INT NOT NULL,
    fK_area                                 INT NOT NULL,
    nombre                                  NVARCHAR(255),
    rango	                                INT NOT NULL,
    prioridad					            INT NOT NULL,
    fecha_inicio                            DATE NOT NULL,
    fecha_final                             DATE NOT NULL,
    notas                                   NVARCHAR(255),
    FOREIGN KEY (fk_EmpleadoAsignado)       REFERENCES Empleados(id_empleado),
    FOREIGN KEY (fK_Area)                   REFERENCES Areas(id_area)
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

        "fk_area_apoyo": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "fk_procesos": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },
        
        "nombre":{
            type: DataTypes.STRING(255),
        },
        
        "estado": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "prioridad": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },
        
        "progreso": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },
        
        "fecha_inicio":{
            type: DataTypes.DATE(255),
            allowNull: false
        },

        "fecha_final":{
            type: DataTypes.DATE(255),
            allowNull: false
        },
        
        "notas":{
            type: DataTypes.STRING(255),
        },
        
        "mostrar": {
            type:DataTypes.INTEGER(),
            allowNull: false
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
            as: 'Empleados'
        });

        /* Union con Areas */
        tareas.belongsTo(models.areas,{
            foreignKey : 'fk_area',
            as : 'Areas'
        });

        tareas.belongsTo(models.areas,{
            foreignKey : 'fk_area_apoyo',
            as : 'AreasApollo'
        });

        /* Union con Procesos */
        tareas.belongsTo(models.procesos,{
            foreignKey : 'fk_procesos',
            as : 'Procesos'
        });

    }

    return tareas;

};