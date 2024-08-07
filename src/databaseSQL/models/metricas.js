/*
CREATE TABLE Metricas (
    id_metrica                              INT PRIMARY KEY AUTO_INCREMENT,
    fk_indicador                            INT NOT NULL,
    dato_metrica                            INT NOT NULL,
    fecha_Metrica                           DATE NOT NULL,
    hora_Metrica                            TIME NOT NULL,
    log_de_usuario                          INT NOT NULL,
    FOREIGN KEY (fk_indicador)              REFERENCES Indicadores(id_indicador),
    FOREIGN KEY (log_de_usuario)            REFERENCES Empleados(id_empleado)
);
*/
module.exports = (sequelize,DataTypes) => {

    let nombre = "metricas";
    
    let columnas = {
        "id_metrica": {
            type:DataTypes.INTEGER(),
            primaryKey: true,
            autoIncrement: true,
        },

        "fk_indicador":{
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "dato_metrica":{
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "fecha_Metrica":{
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "hora_Metrica":{
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "log_de_usuario":{
            type:DataTypes.INTEGER(),
            allowNull: false
        },
        
        
    };
    
    let config =  {
        timestamps: false,
        tableName : "Metricas"
    };

    const metrica = sequelize.define(nombre,columnas,config);

    metrica.associate = (models) => {

        metrica.belongsTo(models.indicadores,{
            foreignKey : 'fk_indicador',
            as : 'Indicadores'
        });

    }

    return metrica;

};