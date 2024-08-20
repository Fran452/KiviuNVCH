/*
CREATE TABLE Subtareas (
    id_sub_tarea                            INT PRIMARY KEY AUTO_INCREMENT,
    fk_tareas                               INT NOT NULL,
    orden                                   INT NOT NULL,    
    titulo                                  VARCHAR(255) NOT NULL,    
    asignacion                              INT NOT NULL,        
    horasAprox                              INT NOT NULL,        
    estado                                  VARCHAR(255) NOT NULL, 
    FOREIGN KEY (fk_tareas)                 REFERENCES Tareas(id_tarea),   
);     
*/
module.exports = (sequelize,DataTypes) => {

    let nombre = "subtareas";
    
    let columnas = {
        
        "id_sub_tarea": {
            type:DataTypes.INTEGER(),
            primaryKey: true,
            autoIncrement: true,
        },

        "fk_tareas": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "orden": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },
        
        "titulo":{
            type: DataTypes.STRING(255),
        },

        "asignacion": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "horasAprox": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "estado":{
            type: DataTypes.STRING(255),
        },

    };

    let config =  {
        timestamps: false,
        tableName : "Subtareas"
    };

    const subtareas = sequelize.define(nombre,columnas,config);

    subtareas.associate = (models) => {

        /* Union con Empleados */
        subtareas.belongsTo(models.tareas,{
            foreignKey : 'fk_tareas',
            as: 'Tareas'
        });

    }

    return subtareas;

};