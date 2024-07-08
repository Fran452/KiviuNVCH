const database = require("mime-db");

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
        },

    };

    let config =  {
        timestamps: false,
        tableName : "Areas"
    };

    const areas = sequelize.define(nombre,columnas,config);

    areas.associate = (models) => {

        /* Union con Empleados */
        areas.hasMany(models.Empleados,{
            foreignKey : 'fk_area',
            as : 'Empleados'
        });

        /* Union con Indicadores */    
        areas.hasMany(models.Indicador,{
            foreignKey : 'fk_area',
            as : 'Indicador'
        });

        /* Union con Tareas */  
        areas.hasMany(models.Tareas,{
            foreignKey : 'fK_Area',
            as : 'Tareas'
        });

        /* Union con Empresas */  
        areas.belongsToMany(models.Area_empresa,{
            as: 'Empresas',
            through : 'Area_empresa',
            foreignKey : 'fkArea',
            otherKey: 'fkEmpresa',
            timestamps : false
        })

    }

    return areas;

};