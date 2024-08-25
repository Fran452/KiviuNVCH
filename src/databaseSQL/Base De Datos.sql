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
    abreviatura                            VARCHAR(255),
    mail                                   VARCHAR(255) NOT NULL,
    FOREIGN KEY (fk_area)                  REFERENCES Areas(id_area),
    FOREIGN KEY (fk_Puesto)                REFERENCES Puestos(id_puesto)
);

CREATE TABLE Ciclos ( 
    id_ciclo                                INT PRIMARY KEY AUTO_INCREMENT,
    fk_area                                 INT NOT NULL,
    nombre                                  VARCHAR(255) NOT NULL,
    detalles                                VARCHAR(255) NOT NULL,
    fecha_inicio                            DATE NOT NULL,
    fecha_final                             DATE NOT NULL,
    ver                                     INT NOT NULL,
    FOREIGN KEY (fk_area)                   REFERENCES Areas(id_area)
);

-- Agregar Sub ciclos / Analisar utilidad de areas

CREATE TABLE Procesos ( 
    id_procesos                             INT PRIMARY KEY AUTO_INCREMENT,
    fk_area                                 INT NOT NULL,
    fk_ciclo                                INT NOT NULL,
    nombre                                  VARCHAR(255) NOT NULL,
    detalles                                VARCHAR(255) NOT NULL,
    ver                                     INT NOT NULL,
    FOREIGN KEY (fk_ciclo)                  REFERENCES Ciclos(id_ciclo),
    FOREIGN KEY (fk_area)                   REFERENCES Areas(id_area)
);

CREATE TABLE Tareas (
    id_tarea                                INT PRIMARY KEY AUTO_INCREMENT,
    fk_empleado_asignado                    INT NOT NULL,
    fk_area                                 INT NOT NULL,
--  fk_area_apoyo                           INT NOT NULL,
    fk_procesos                             INT NOT NULL,
    nombre                                  VARCHAR(255) NOT NULL,
    estado	                                INT, -- de no ser agregado se le asigna 1
    prioridad					            INT NOT NULL,  -- default 2
--  fecha_inicio                            DATE NOT NULL,
    fecha_final                             DATE NOT NULL, -- 31/12/ actual año
    notas                                   VARCHAR(255),
    progreso					            INT,            -- 0
    horas_totales                           INT NOT NULL,  -- 0
    ver                                     INT NOT NULL, 
    FOREIGN KEY (fk_empleado_asignado)      REFERENCES Empleados(id_empleado),
--  FOREIGN KEY (fk_area_apoyo)             REFERENCES Areas(id_area),
    FOREIGN KEY (fk_procesos)               REFERENCES Procesos(id_procesos),
    FOREIGN KEY (fk_area)                   REFERENCES Areas(id_area)
);

CREATE TABLE Subtareas (
    id_sub_tarea                            INT PRIMARY KEY AUTO_INCREMENT,
    fk_tareas                               INT NOT NULL,
    titulo                                  VARCHAR(255) NOT NULL,
    asignacion                              INT NOT NULL,   -- persona de la tarea
    horasAprox                              INT NOT NULL,
    avece                                   VARCHAR(255) NOT NULL, --
    estado                                  VARCHAR(255) NOT NULL, -- 
    prioridad                               VARCHAR(255),
    notas                                   VARCHAR(255),
    ver                                     INT NOT NULL,
    FOREIGN KEY (asignacion)                REFERENCES Empleados(id_empleado),
    FOREIGN KEY (fk_tareas)                 REFERENCES Tareas(id_tarea)
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
    fecha_Metrica                           DATETIME NOT NULL,
    log_de_usuario                          INT NOT NULL,
    FOREIGN KEY (fk_indicador)              REFERENCES Indicadores(id_indicador),
    FOREIGN KEY (log_de_usuario)            REFERENCES Empleados(id_empleado)
);

INSERT INTO Puestos (nombre_puesto) VALUES 
('Gerente'), 
('Analista'), 
('Asistente');