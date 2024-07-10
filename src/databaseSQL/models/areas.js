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
        tableName : "areas"
    };

    const areas = sequelize.define(nombre,columnas,config);
    
    
    areas.associate = (models) => {

        // Union con Empleados
        areas.hasMany(models.empleados,{
            foreignKey : 'fk_area',
            as : 'Empleados'
        });
        
        // Union con Tareas   
        areas.hasMany(models.tareas,{
            foreignKey : 'fk_area',
            as : 'Tareas'
        });

        /*
        // Union con Indicadores
        areas.hasMany(models.indicadores,{
            foreignKey : 'fk_area',
            as : 'Indicador'
        });

        // Union con Empresas  
        areas.belongsToMany(models.area_empresa,{
            as: 'Empresas',
            through : 'Area_empresa',
            foreignKey : 'fk_empresa',
            otherKey: 'fk_area',
            timestamps : false
        })*/
        

    }

    return areas;

};