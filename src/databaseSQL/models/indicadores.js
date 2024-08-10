/*
CREATE TABLE Indicador (
    id_indicador                           INT PRIMARY KEY IDENTITY(1,1),
    fk_area                                INT NOT NULL,
    fk_responsable                         INT NOT NULL,
    fk_responsable_sumplente               INT NOT NULL,
    nombre_indicador                       NVARCHAR(255),
    detalles_metrica                       NVARCHAR(255),
    tipo_recordartorio                     INT NOT NULL,
    fecha_del_recodatorio                  DATE, 
    mostrar                                INT NOT NULL,
    FOREIGN KEY (fk_area)                  REFERENCES Areas(id_area),
    FOREIGN KEY (fk_responsable)           REFERENCES Empleados(id_empleado),
    FOREIGN KEY (fk_responsable_sumplente) REFERENCES Empleados(id_empleado)
);
*/
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

        "fk_responsable_suplente":{
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "nombre_indicador":{
            type: DataTypes.STRING(255),
            allowNull: false
        },

        "detalles_metrica":{
            type: DataTypes.STRING(255),
            allowNull: false
        },

        "tipo_recordartorio":{
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "fecha_del_recodatorio":{
            type: DataTypes.DATE(255),
            allowNull: false
        },
                
        "mostrar":{
            type:DataTypes.INTEGER(),
            allowNull: false
        }
        
    };
    
    let config =  {
        timestamps: false,
        tableName : "Indicadores"
    };

    const indicadores = sequelize.define(nombre,columnas,config);

    indicadores.associate = (models) => {

        indicadores.belongsTo(models.empleados,{
            foreignKey : 'fk_responsable',
            as : 'Empleados'
        });

        indicadores.belongsTo(models.empleados,{
            foreignKey : 'fk_responsable_suplente',
            as : 'ResponsableSuplente'
        });

        indicadores.belongsTo(models.areas,{
            foreignKey : 'fk_area',
            as : 'Areas'
        });
        
    }

    return indicadores;

};