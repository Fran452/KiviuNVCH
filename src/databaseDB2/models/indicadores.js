const database = require("mime-db");

module.exports = (sequelize,DataTypes) => {

    let nombre = "indicadores";
    
    let columnas = {
        "id_indicador": {
            type:DataTypes.INTEGER(),
            primaryKey: true,
            autoIncrement: true,
        },

        "fk_area":{
            type:DataTypes.INTEGER(),
            allowNull: false
        },
        
        "fk_responsable":{
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "fk_responsable_sumplente":{
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "nombre_indicador":{
            type: DataTypes.STRING(255),
            allowNull: false
        },

        "recordartorio":{
            type: DataTypes.DATE(255),
            allowNull: false
        },

    };
/*

fk_responsable
fk_responsable_sumplente
nombre_indicador
recordartorio
*/
    let config =  {
        timestamps: false,
        tableName : "Indicadores"
    };

    const indicadores = sequelize.define(nombre,columnas,config);

    indicadores.associate = (models) => {

        indicadores.hasMany(models.Empleados,{
            foreignKey : 'fk_area',
            as : 'Empleados'
        });

    }

    return indicadores;

};