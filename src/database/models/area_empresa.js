/*
CREATE TABLE Area_empresa ( 
    id_area_empresa                         INT PRIMARY KEY IDENTITY(1,1),
    fk_empresa                              INT NOT NULL,
    fk_area                                 INT NOT NULL,
    FOREIGN KEY (fk_empresa)                REFERENCES Empresas(Id_empresa),
    FOREIGN KEY (fk_area)                   REFERENCES Areas(id_area)
);  
*/

module.exports = (sequelize,DataTypes) => {

    let nombre = "area_empresa";
    
    let columnas = {
        "id_area_empresa": {
            type:DataTypes.INTEGER(),
            primaryKey: true,
            autoIncrement: true,
        },

        "fk_empresa":{
            type:DataTypes.INTEGER(),
        },
        
        "fk_area":{
            type:DataTypes.INTEGER(),
        },

    };

    let config =  {
        timestamps: false,
        tableName : "Area_empresa"
    };

    const area_empresa = sequelize.define(nombre,columnas,config);

    return area_empresa;

};