/*
CREATE TABLE Ciclos ( 
    id_ciclo                                INT PRIMARY KEY AUTO_INCREMENT,
    nombre                                  VARCHAR(255) NOT NULL,
    detalles                                VARCHAR(255) NOT NULL,
    ver                                     INT NOT NULL,
);
*/
module.exports = (sequelize,DataTypes) => {

    let nombre = "ciclos";
    
    let columnas = {

        "id_ciclo": {
            type:DataTypes.INTEGER(),
            primaryKey: true,
            autoIncrement: true,
        },

        "fk_area": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "nombre":{
            type: DataTypes.STRING(255),
        },
        
        "detalles":{
            type: DataTypes.STRING(255),
        },

        "ver":{
            type: DataTypes.INTEGER(),
        },

    };

    let config =  {
        timestamps: false,
        tableName : "Ciclos"
    };

    const cilcos = sequelize.define(nombre,columnas,config);
    
    
    cilcos.associate = (models) => {

        // Union con Empleados
        cilcos.hasMany(models.tareas,{
            foreignKey : 'fk_ciclo',
            as : 'Tareas'
        });
        
        // Union con Areas
        cilcos.belongsTo(models.areas,{
            foreignKey : 'fk_area',
            as : 'Areas'
        });

    }

    return cilcos;

};