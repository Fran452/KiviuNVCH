/*
CREATE TABLE muestras (
    id_muestras                           INT PRIMARY KEY AUTO_INCREMENT,
    fk_sub_tareas                           INT NOT NULL,
    numero_de_orden                         INT NOT NULL,
    titulo                                  VARCHAR(255) NOT NULL,
    responsable                             INT NOT NULL, -- persona de la tarea
    horasAprox                              INT NOT NULL, -- Defoult 4hr
    avance                                  INT NOT NULL, -- Defoult "0"
    notas                                   VARCHAR(255), -- Defoult " "
    ver                                     INT NOT NULL,
    FOREIGN KEY (asignacion)                REFERENCES Empleados(id_empleado),
    FOREIGN KEY (fk_sub_tareas)             REFERENCES Subtareas(id_sub_tarea)
);         
*/
module.exports = (sequelize,DataTypes) => {

    let nombre = "muestras";
    
    let columnas = {
        
        "id_muestra": {
            type:DataTypes.INTEGER(),
            primaryKey: true,
            autoIncrement: true,
        },

        "fk_sub_tareas": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "numero_de_orden": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "titulo":{
            type: DataTypes.STRING(255),
        },
        
        "responsable": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "horasAprox": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "avance": {
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
        tableName : "Muestras"
    };

    const muestras = sequelize.define(nombre,columnas,config);

    muestras.associate = (models) => {

        muestras.belongsTo(models.subtareas,{
            foreignKey : 'fk_sub_tareas',
            as: 'SubTareas'
        });

        muestras.belongsTo(models.empleados,{
            foreignKey : 'responsable',
            as: 'Empleados'
        });

    }
    
    return muestras;

};