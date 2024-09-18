/*
CREATE TABLE SubSubtareas (
    id_sub_sub_tarea                        INT PRIMARY KEY AUTO_INCREMENT,
    fk_sub_tareas                           INT NOT NULL,
    titulo                                  VARCHAR(255) NOT NULL,
    asignacion                              INT NOT NULL, -- persona de la tarea
    horasAprox                              INT NOT NULL, -- Defoult 4hr
    avance                                  INT NOT NULL, -- Defoult "0"
    estado                                  INT NOT NULL,
    prioridad                               INT,
    notas                                   VARCHAR(255), -- Defoult "notas"
    fecha_inicio                            DATE NOT NULL,
    fecha_final                             DATE,
    ver                                     INT NOT NULL,
    FOREIGN KEY (asignacion)                REFERENCES Empleados(id_empleado),
    FOREIGN KEY (fk_sub_tareas)             REFERENCES Subtareas(id_sub_tarea)
);             
 
*/
module.exports = (sequelize,DataTypes) => {

    let nombre = "subsubtareas";
    
    let columnas = {
        
        "id_sub_sub_tarea": {
            type:DataTypes.INTEGER(),
            primaryKey: true,
            autoIncrement: true,
        },

        "fk_sub_tareas": {
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
            type:DataTypes.INTEGER(),
        },

        "prioridad": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "notas": {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        "fecha_inicio":{
            type: DataTypes.DATE(255),
            allowNull: false
        },

        "fecha_final":{
            type: DataTypes.DATE(255),
        },
        
        "ver":{
            type:DataTypes.INTEGER(),
            allowNull: false
        }

    };

    let config =  {
        timestamps: false,
        tableName : "SubSubtareas"
    };

    const subsubtareas = sequelize.define(nombre,columnas,config);

    subsubtareas.associate = (models) => {

        subsubtareas.belongsTo(models.subtareas,{
            foreignKey : 'fk_sub_tareas',
            as: 'SubTareas'
        });

        subsubtareas.belongsTo(models.empleados,{
            foreignKey : 'asignacion',
            as: 'Empleados'
        });

    }
    
    return subsubtareas;

};