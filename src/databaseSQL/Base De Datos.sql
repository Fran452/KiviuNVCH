CREATE DATABASE kiviuTest;


USE kiviuTest;


CREATE TABLE Areas (
    id_area                                INT PRIMARY KEY AUTO_INCREMENT, 
    power_Bi                               VARCHAR(255),
    nombre_del_Area                        VARCHAR(255)  
);

CREATE TABLE Puestos (         
    id_puesto                              INT PRIMARY KEY AUTO_INCREMENT,
    nombre_puesto                          VARCHAR(255) NOT NULL
);    

CREATE TABLE Empleados (           
    id_empleado                            INT PRIMARY KEY AUTO_INCREMENT,
    fk_area                                INT NOT NULL,
    fk_puesto                              INT NOT NULL,
    nombre                                 VARCHAR(255),
    password                               VARCHAR(255) NOT NULL,
    mail                                   VARCHAR(255) NOT NULL,
    sucursal                               VARCHAR(255),
    FOREIGN KEY (fk_area)                  REFERENCES Areas(id_area),
    FOREIGN KEY (fk_Puesto)                REFERENCES Puestos(id_puesto)
);

CREATE TABLE Proyectos ( 
    id_proyecto                             INT PRIMARY KEY AUTO_INCREMENT,
    fk_area                                 INT NOT NULL,
    nombre                                  VARCHAR(255) NOT NULL,
    detalles                                VARCHAR(255) NOT NULL,
    ver                                     INT NOT NULL,
    FOREIGN KEY (fk_area)                   REFERENCES Areas(id_area)
);

CREATE TABLE Tareas (
    id_tarea                                INT PRIMARY KEY AUTO_INCREMENT,
    fk_empleado_asignado                    INT NOT NULL,
    fk_area                                 INT NOT NULL,
    fk_area_apoyo                           INT NOT NULL,
    nombre                                  VARCHAR(255) NOT NULL,
    fk_proyecto                             INT NOT NULL,                             
    estado	                                INT NOT NULL,
    prioridad					            INT NOT NULL,
    fecha_inicio                            DATE NOT NULL,
    fecha_final                             DATE NOT NULL,
    notas                                   VARCHAR(255),
    mostrar                                 INT NOT NULL,
    progreso					            INT,
    FOREIGN KEY (fk_empleado_asignado)      REFERENCES Empleados(id_empleado),
    FOREIGN KEY (fk_area_apoyo)             REFERENCES Areas(id_area),
    FOREIGN KEY (fk_proyecto)               REFERENCES Proyectos(id_proyecto),
    FOREIGN KEY (fk_area)                   REFERENCES Areas(id_area)
);

CREATE TABLE Indicadores (
    id_indicador                           INT PRIMARY KEY AUTO_INCREMENT,
    fk_area                                INT NOT NULL,
    fk_responsable                         INT NOT NULL,
    fk_responsable_suplente                INT NOT NULL,
    nombre_indicador                       VARCHAR(255),
    detalles_metrica                       VARCHAR(255),
    tipo_recordartorio                     INT NOT NULL,
    fecha_del_recodatorio                  DATE, 
    mostrar                                INT NOT NULL,
    FOREIGN KEY (fk_area)                  REFERENCES Areas(id_area),
    FOREIGN KEY (fk_responsable)           REFERENCES Empleados(id_empleado),
    FOREIGN KEY (fk_responsable_suplente)  REFERENCES Empleados(id_empleado)
);

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


/* Proximos proyectos */


CREATE TABLE Subtareas (    
    id_subtarea                             INT PRIMARY KEY AUTO_INCREMENT,
    fk_tarea                                INT NOT NULL,
    fk_empleado_asignado                    INT NOT NULL,
    nombre                                  VARCHAR(255),
    rango	                                INT NOT NULL,
    prioridad					            INT NOT NULL,
    fecha_inicio                            DATE NOT NULL,
    fecha_final                             DATE NOT NULL,
    notas                                   VARCHAR(255),
    progreso					            INT,
    FOREIGN KEY (fk_tarea)                  REFERENCES Tareas(id_tarea),
    FOREIGN KEY (fk_empleado_asignado)      REFERENCES Empleados(id_empleado)
);  

CREATE TABLE Empresas ( 
    Id_empresa                              INT PRIMARY KEY AUTO_INCREMENT,
    nombre_de_la_Empresa                    VARCHAR(255) NOT NULL
);  

CREATE TABLE Area_empresa ( 
    id_area_empresa                         INT PRIMARY KEY AUTO_INCREMENT,
    fk_empresa                              INT NOT NULL,
    fk_area                                 INT NOT NULL,
    FOREIGN KEY (fk_empresa)                REFERENCES Empresas(Id_empresa),
    FOREIGN KEY (fk_area)                   REFERENCES Areas(id_area)
);
