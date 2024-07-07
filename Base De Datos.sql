CREATE TABLE Areas (
    Id_area INT PRIMARY KEY IDENTITY(1,1), 
    PowerBi NVARCHAR(255),
	NombreDelArea NVARCHAR(255)  
);

CREATE TABLE Puestos (
    Id_puesto INT PRIMARY KEY IDENTITY(1,1),
    nombre_puesto NVARCHAR(255) NOT NULL,

);

CREATE TABLE Empleados (

);

CREATE TABLE Indicador (
    Id_indicador INT PRIMARY KEY IDENTITY(1,1),
    FK_area INT NOT NULL,
    Fk_responsable INT NOT NULL,
    Fk_responsable_sumplente INT NOT NULL,
    nombre_indicador NVARCHAR(255),
    recordartorio DATETIME
);

CREATE TABLE Metrica (
);

CREATE TABLE Tareas (
);

CREATE TABLE Subtareas (
);


CREATE TABLE Empresa (
);

CREATE TABLE Area_empresa (
);