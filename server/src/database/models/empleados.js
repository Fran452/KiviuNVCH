/*
CREATE TABLE Empleados (           
    id_empleado                            INT PRIMARY KEY AUTO_INCREMENT,
    fk_area                                INT NOT NULL,
    fk_puesto                              INT NOT NULL,
    nombre                                 VARCHAR(255),
    password                               VARCHAR(255) NOT NULL,
    abreviatura                            VARCHAR(255) NOT NULL,
    mail                                   VARCHAR(255) NOT NULL,
    FOREIGN KEY (fk_area)                  REFERENCES Areas(id_area),
    FOREIGN KEY (fk_Puesto)                REFERENCES Puestos(id_puesto)
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

        "fk_area": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },
        
        "fk_Puesto": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "nombre":{
            type: DataTypes.STRING(255),
        },
        
        "password":{
            type: DataTypes.STRING(255),
            allowNull: false
        },
        
        "abreviatura":{
            type: DataTypes.STRING(255),
        },

        "mail":{
            type: DataTypes.STRING(255),
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