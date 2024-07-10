/*
CREATE TABLE Puestos (         
    id_puesto                              INT PRIMARY KEY IDENTITY(1,1),
    nombre_puesto                          NVARCHAR(255) NOT NULL,
);      
*/

module.exports = (sequelize,DataTypes) => {

    let nombre = "puestos";
    
    let columnas = {
        "id_puesto": {
            type:DataTypes.INTEGER(),
            primaryKey: true,
            autoIncrement: true,
        }, 

        "nombre_puesto":{
            type: DataTypes.STRING(255),
        },

    };

    let config =  {
        timestamps: false,
        tableName : "Puestos"
    };

    const puestos = sequelize.define(nombre,columnas,config);

    puestos.associate = (models) => {

        /* Union con Empleados */
        puestos.hasMany(models.empleados,{
            foreignKey : 'fk_puesto',
            as : 'Empleados'
        });
    }

    return puestos;

};