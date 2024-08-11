/*
CREATE TABLE Empleados (           
    id_empleado                            INT PRIMARY KEY IDENTITY(1,1),
    fk_area                                INT NOT NULL,
    fk_puesto                              INT NOT NULL,
    nombre                                 NVARCHAR(255),
    contraseña                             NVARCHAR(255) NOT NULL,
    mail                                   NVARCHAR(255) NOT NULL,
    sucursal                               NVARCHAR(255),
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

        "mail":{
            type: DataTypes.STRING(255),
            allowNull: false
        },

        "sucursal":{
            type: DataTypes.STRING(255),
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

        
        empleados.hasMany(models.indicadores,{
            foreignKey : 'fk_responsable',
            as : 'Indicadores'
        });

        empleados.hasMany(models.indicadores,{
            foreignKey : 'fk_responsable_suplente',
            as : 'IndicadoresSuplente'
        });

        empleados.hasMany(models.metricas,{
            foreignKey : 'log_de_usuario',
            as : 'Empleados'
        });

    }

    return empleados;

};