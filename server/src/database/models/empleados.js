/*
CREATE TABLE Empleados (           
    id_empleado                            INT PRIMARY KEY AUTO_INCREMENT,
    id_authero                             INT,
    fk_area                                INT NOT NULL,
    fk_puesto                              INT NOT NULL,
    nombre                                 VARCHAR(255),
    abreviatura                            VARCHAR(255),
    mail                                   VARCHAR(255) NOT NULL,
    estado                                 INT NOT NULL,
    FOREIGN KEY (fk_area)                  REFERENCES Areas(id_area),
    FOREIGN KEY (fk_puesto)                REFERENCES Puestos(id_puesto)
);
*/

module.exports = (sequelize,DataTypes) => {

    let nombre = "empleados";
    
    let columnas = {
        "id_empleado": {
            type:DataTypes.INTEGER(),
            primaryKey: true,
            autoIncrement: true,
        },

        "id_authero": {
            type:DataTypes.INTEGER(),
        },

        "fk_area": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },
        
        "fk_puesto": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "nombre":{
            type: DataTypes.STRING(255),
        }, 
        
        "abreviatura":{
            type: DataTypes.STRING(255),
        },

        "mail":{
            type: DataTypes.STRING(255),
            allowNull: false
        },

        "estado":{
            type:DataTypes.INTEGER(),
            allowNull: false
        },

    };

    let config =  {
        timestamps: false,
        tableName : "Empleados"
    };

    const empleados = sequelize.define(nombre,columnas,config);

    empleados.associate = (models) => {

        empleados.belongsTo(models.areas,{
            foreignKey : 'fk_area',
            as : 'Areas'
        });

        empleados.belongsTo(models.puestos,{
            foreignKey : 'fk_puesto',
            as : 'Puestos'
        });

        empleados.hasMany(models.tareas,{
            foreignKey : 'fk_empleado_asignado',
            as : 'Tareas'
        });

        empleados.hasMany(models.subtareas,{
            foreignKey : 'asignacion',
            as : 'SubTareas'
        });

        empleados.hasMany(models.muestras,{
            foreignKey : 'responsable',
            as: 'Empleados'
        });
        
    }

    return empleados;

};