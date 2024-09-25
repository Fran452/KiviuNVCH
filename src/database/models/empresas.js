/*
CREATE TABLE Empresas ( 
    Id_empresa                              INT PRIMARY KEY AUTO_INCREMENT,
    nombre_de_la_Empresa                    VARCHAR(255) NOT NULL
);  
*/

module.exports = (sequelize,DataTypes) => {

    let nombre = "empresas";
    
    let columnas = {
        "Id_empresa": {
            type:DataTypes.INTEGER(),
            primaryKey: true,
            autoIncrement: true,
        },

        "nombre_de_la_Empresa":{
            type: DataTypes.STRING(255),
            allowNull: false
        },
        
    };

    let config =  {
        timestamps: false,
        tableName : "Empresas"
    };

    const empresas = sequelize.define(nombre,columnas,config);

    empresas.associate = (models) => {

        // Union con Areas  
        empresas.belongsToMany(models.area_empresa,{
            as: 'Areas',
            through : 'Area_empresa',
            foreignKey : 'fk_area',
            otherKey: 'fk_empresa',
            timestamps : false
        });
    
    }
    return empresas;

};