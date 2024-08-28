/*
CREATE TABLE Procesos ( 
    id_procesos                             INT PRIMARY KEY AUTO_INCREMENT,
    fk_area                                 INT NOT NULL,
    fk_ciclo                                INT NOT NULL,
    nombre                                  VARCHAR(255) NOT NULL,
    detalles                                VARCHAR(255) NOT NULL,
    ver                                     INT NOT NULL,
    FOREIGN KEY (fk_ciclo)                   REFERENCES Ciclos(id_ciclo),
    FOREIGN KEY (fk_area)                   REFERENCES Areas(id_area)
);

*/

//! Sin utilizacion eliminacion
module.exports = (sequelize,DataTypes) => {

    let nombre = "procesos";
    
    let columnas = {

        "id_procesos": {
            type:DataTypes.INTEGER(),
            primaryKey: true,
            autoIncrement: true,
        },

        "fk_area": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "fk_ciclo": {
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

        "fecha_inicio":{
            type: DataTypes.DATE(255),
            allowNull: false
        },
        
        "fecha_final":{
            type: DataTypes.DATE(255),
            allowNull: false
        },
    };

    let config =  {
        timestamps: false,
        tableName : "Procesos"
    };

    const procesos = sequelize.define(nombre,columnas,config);
    
    
    procesos.associate = (models) => {

        // Union con Areas
        procesos.belongsTo(models.areas,{
            foreignKey : 'fk_area',
            as : 'Areas'
        });

        // Union con Tareas
        procesos.hasMany(models.tareas,{
            foreignKey : 'fk_procesos',
            as : 'Tareas'
        });

        procesos.belongsTo(models.ciclos,{
            foreignKey : 'fk_ciclo',
            as : 'Ciclos'
        });

        

    }

    return procesos;

};