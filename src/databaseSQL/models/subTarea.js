/*
CREATE TABLE Subtareas (
    id_sub_tarea                            INT PRIMARY KEY AUTO_INCREMENT,
    fk_tareas                               INT NOT NULL,
    titulo                                  VARCHAR(255) NOT NULL,
    asignacion                              INT NOT NULL,   -- persona de la tarea
    horasAprox                              INT NOT NULL,
    avance                                  VARCHAR(255) NOT NULL, --
    estado                                  VARCHAR(255) NOT NULL, -- 
    prioridad                               VARCHAR(255),
    notas                                   VARCHAR(255),
    ver                                     INT NOT NULL,
    FOREIGN KEY (asignacion)                REFERENCES Empleados(id_empleado),
    FOREIGN KEY (fk_tareas)                 REFERENCES Tareas(id_tarea)
);                 
 
*/
module.exports = (sequelize,DataTypes) => {

    let nombre = "subtareas";
    
    let columnas = {
        
        "id_sub_tarea": {
            type:DataTypes.INTEGER(),
            primaryKey: true,
            autoIncrement: true,
        },

        "fk_tareas": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },
        
        "titulo":{
            type: DataTypes.STRING(255),
        },

        "avance": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "asignacion": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "horasAprox": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "estado":{
            type: DataTypes.STRING(255),
        },

        "prioridad": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "notas": {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        
        "ver":{
            type:DataTypes.INTEGER(),
            allowNull: false
        }

    };

    let config =  {
        timestamps: false,
        tableName : "Subtareas"
    };

    const subtareas = sequelize.define(nombre,columnas,config);

    subtareas.associate = (models) => {

        subtareas.belongsTo(models.tareas,{
            foreignKey : 'fk_tareas',
            as: 'Tareas'
        });

        subtareas.belongsTo(models.empleados,{
            foreignKey : 'asignacion',
            as: 'Empleados'
        });

    }

    return subtareas;

};