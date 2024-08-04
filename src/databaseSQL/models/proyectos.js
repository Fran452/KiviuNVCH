/*
CREATE TABLE Proyecto ( 
    id_preyecto                             INT PRIMARY KEY AUTO_INCREMENT,
    fk_area                                 INT NOT NULL,
    nombre                                  VARCHAR(255) NOT NULL,
    detalles                                VARCHAR(255) NOT NULL,
    FOREIGN KEY (fk_area)                   REFERENCES Areas(id_area),
);

*/
module.exports = (sequelize,DataTypes) => {

    let nombre = "proyectos";
    
    let columnas = {

        "id_proyecto": {
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

        "ver": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },
    };

    let config =  {
        timestamps: false,
        tableName : "Proyectos"
    };

    const proyectos = sequelize.define(nombre,columnas,config);
    
    
    proyectos.associate = (models) => {

        // Union con Areas
        proyectos.belongsTo(models.areas,{
            foreignKey : 'fk_area',
            as : 'Areas'
        });

        // Union con Tareas
        proyectos.hasMany(models.tareas,{
            foreignKey : 'fk_proyecto',
            as : 'Tareas'
        });

    }

    return proyectos;

};