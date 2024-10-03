/*
CREATE TABLE Areas (
    id_area                                INT PRIMARY KEY IDENTITY(1,1), 
    power_Bi                               NVARCHAR(255),
	nombre_del_Area                        NVARCHAR(255)  
);
*/
module.exports = (sequelize,DataTypes) => {

    let nombre = "areas";
    
    let columnas = {

        "id_area": {
            type:DataTypes.INTEGER(),
            primaryKey: true,
            autoIncrement: true,
        },

        "power_Bi":{
            type: DataTypes.STRING(255),
        },
        
        "nombre_del_Area":{
            type: DataTypes.STRING(255),
        }

    };

    let config =  {
        timestamps: false,
        tableName : "Areas"
    };

    const areas = sequelize.define(nombre,columnas,config);
    
    
    areas.associate = (models) => {

        // Union con Empleados
        areas.hasMany(models.empleados,{
            foreignKey : 'fk_area',
            as : 'Empleados'
        });

        // Union con Ciclos   
        areas.hasMany(models.ciclos,{
            foreignKey : 'fk_area',
            as : 'Ciclos'
        });

        // Union con Tareas   
        areas.hasMany(models.tareas,{
            foreignKey : 'fk_area',
            as : 'Tareas'
        });
        

    }

    return areas;

};