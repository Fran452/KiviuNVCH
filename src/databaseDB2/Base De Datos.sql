CREATE DATABASE [kiviuTest];
GO

USE [kiviuTest]
GO

CREATE TABLE Areas (
    id_area                                INT PRIMARY KEY IDENTITY(1,1), 
    power_Bi                               NVARCHAR(255),
	nombre_del_Area                        NVARCHAR(255)  
);

CREATE TABLE Puestos (         
    id_puesto                              INT PRIMARY KEY IDENTITY(1,1),
    nombre_puesto                          NVARCHAR(255) NOT NULL,
);         
        
CREATE TABLE Empleados (           
    id_empleado                            INT PRIMARY KEY IDENTITY(1,1),
    fk_area                                INT NOT NULL,
    fk_puesto                              INT NOT NULL,
    nombre                                 NVARCHAR(255),
    contraseña                             NVARCHAR(255) NOT NULL,
    mail                                   NVARCHAR(255) NOT NULL,
    sucursal                               NVARCHAR(255),
    FOREIGN KEY (fk_area)                  REFERENCES Areas(id_area),
    FOREIGN KEY (fk_Puesto)                REFERENCES Puestos(id_puesto)

);

CREATE TABLE Indicador (
    id_indicador                           INT PRIMARY KEY IDENTITY(1,1),
    fk_area                                INT NOT NULL,
    fk_responsable                         INT NOT NULL,
    fk_responsable_sumplente               INT NOT NULL,
    nombre_indicador                       NVARCHAR(255),
    recordartorio                          DATETIME
    FOREIGN KEY (fk_area)                  REFERENCES Areas(id_area),
    FOREIGN KEY (fk_responsable)           REFERENCES Empleados(id_empleado),
    FOREIGN KEY (fk_responsable_sumplente) REFERENCES Empleados(id_empleado)
);

CREATE TABLE Metrica (
    id_metrica                              INT PRIMARY KEY IDENTITY(1,1),
    fk_indicador                            INT NOT NULL,
    dato_metrica                            INT NOT NULL,
    fecha_Metrica                           DATE NOT NULL,
    hora_Metrica                            TIME NOT NULL,
    FOREIGN KEY (fk_indicador)              REFERENCES Indicador(id_indicador),
);

CREATE TABLE Tareas (
    id_tarea                                INT PRIMARY KEY IDENTITY(1,1),
    fk_empleado_asignado                    INT NOT NULL,
    fK_area                                 INT NOT NULL,
    nombre                                  NVARCHAR(255),
    rango	                                INT NOT NULL,
    prioridad					            INT NOT NULL,
    fecha_inicio                            DATE NOT NULL,
    fecha_final                             DATE NOT NULL,
    notas                                   NVARCHAR(255),
    FOREIGN KEY (fk_EmpleadoAsignado)       REFERENCES Empleados(id_empleado),
    FOREIGN KEY (fK_Area)                   REFERENCES Areas(id_area)
);  

CREATE TABLE Subtareas (    
    id_subtarea                             INT PRIMARY KEY IDENTITY(1,1),
    fk_tarea                                INT NOT NULL,
    fk_e0mpleado_asignado                   INT NOT NULL,
    nombre                                  NVARCHAR(255),
    rango	                                INT NOT NULL,
    prioridad					            INT NOT NULL,
    fecha_inicio                            DATE NOT NULL,
    fecha_final                             DATE NOT NULL,
    notas                                   NVARCHAR(255),
    FOREIGN KEY (fkTarea)                   REFERENCES Tareas(id_tarea),
    FOREIGN KEY (fkEmpleadoAsignado)        REFERENCES Empleados(id_empleado),
);  

CREATE TABLE Empresas ( 
    Id_empresa                              INT PRIMARY KEY IDENTITY(1,1),
    nombre_de_la_Empresa                    NVARCHAR(255) NOT NULL,
);  

CREATE TABLE Area_empresa ( 
    id_area_empresa                         INT PRIMARY KEY IDENTITY(1,1),
    fk_empresa                              INT NOT NULL,
    fk_area                                 INT NOT NULL,
    FOREIGN KEY (fkEmpresa)                 REFERENCES Empresas(Id_empresa),
    FOREIGN KEY (fkArea)                    REFERENCES Areas(id_area),
);  