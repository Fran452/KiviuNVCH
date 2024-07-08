module.exports = (sequelize,DataTypes) => {

    let nombre = "empleados";
    
    let columnas = {
        "id_empleado": {
            type:DataTypes.INTEGER(),
            primaryKey: true,
            autoIncrement: true,
        },

        "fk_area": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },
        
        "fk_Puesto": {
            type:DataTypes.INTEGER(),
            allowNull: false
        },

        "nombre":{
            type: DataTypes.STRING(255),
        },
        
        "contraseña":{
            type: DataTypes.STRING(255),
            allowNull: false
        },

        "mail":{
            type: DataTypes.STRING(255),
            allowNull: false
        },

        "sucursal":{
            type: DataTypes.STRING(255),
        },

    };

    let config =  {
        timestamps: false,
        tableName : "Empleados"
    };

    const empleados = sequelize.define(nombre,columnas,config);

    empleados.associate = (models) => {

        empleados.belongsTo(models.carrito,{
            foreignKey : 'fk_area',
            as : 'Areas'
        });

        empleados.belongsTo(models.carrito,{
            foreignKey : 'fk_puesto',
            as : 'Puestos'
        });

    }

    return empleados;

};