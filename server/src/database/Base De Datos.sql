CREATE DATABASE kiviuBanco;


USE kiviuBanco;


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
    id_authero                             INT,
    fk_area                                INT NOT NULL,
    fk_puesto                              INT NOT NULL,
    nombre                                 VARCHAR(255),
    abreviatura                            VARCHAR(255),
    mail                                   VARCHAR(255) NOT NULL,
    estado                                 INT NOT NULL,
    FOREIGN KEY (fk_area)                  REFERENCES Areas(id_area),
    FOREIGN KEY (fk_puesto)                REFERENCES Puestos(id_puesto)
);

-- Estados del usuario: 
-- 1: usuario activo
-- 0: usuario inactivo

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


CREATE TABLE Tareas (
    id_tarea                                INT PRIMARY KEY AUTO_INCREMENT,
    fk_empleado_asignado                    INT NOT NULL,
    fk_area                                 INT NOT NULL,
    fk_ciclo                                INT NOT NULL,
    nombre                                  VARCHAR(255) NOT NULL,
    prioridad					            INT NOT NULL,  -- default 2
    fecha_inicio                            DATE NOT NULL,
    notas                                   VARCHAR(255),
    numero_de_orden                         INT NOT NULL,
    ver                                     INT NOT NULL, 
    FOREIGN KEY (fk_empleado_asignado)      REFERENCES Empleados(id_empleado),
    FOREIGN KEY (fk_ciclo)                  REFERENCES Ciclos(id_ciclo),
    FOREIGN KEY (fk_area)                   REFERENCES Areas(id_area)
);

CREATE TABLE Subtareas (
    id_sub_tarea                            INT PRIMARY KEY AUTO_INCREMENT,
    fk_tareas                               INT NOT NULL,
    titulo                                  VARCHAR(255) NOT NULL,
    asignacion                              INT NOT NULL, -- persona de la tarea
    horasAprox                              INT NOT NULL, -- Defoult 4hr
    avance                                  INT NOT NULL, -- Defoult "0"
    estado                                  INT NOT NULL,
    prioridad                               INT,
    notas                                   VARCHAR(255), -- Defoult "notas"
    fecha_inicio                            DATE NOT NULL,
    fecha_final                             DATE,
    ver                                     INT NOT NULL,
    FOREIGN KEY (asignacion)                REFERENCES Empleados(id_empleado),
    FOREIGN KEY (fk_tareas)                 REFERENCES Tareas(id_tarea)
);  

CREATE TABLE Muestras (
    id_muestra                              INT PRIMARY KEY AUTO_INCREMENT,
    fk_sub_tareas                           INT NOT NULL,
    numero_de_orden                         INT NOT NULL,
    titulo                                  VARCHAR(255) NOT NULL,
    responsable                             INT NOT NULL, -- persona de la tarea
    horasAprox                              INT NOT NULL, -- Defoult 4hr
    avance                                  INT NOT NULL, -- Defoult "0"
    notas                                   VARCHAR(255), -- Defoult " "
    ver                                     INT NOT NULL,
    FOREIGN KEY (responsable)               REFERENCES Empleados(id_empleado),
    FOREIGN KEY (fk_sub_tareas)             REFERENCES Subtareas(id_sub_tarea)
);

INSERT INTO Puestos (nombre_puesto) VALUES 
('Gerente'), 
('Analista'), 
('Asistente');

-- Estados de las subtareas:
--  1 Pendiente (Default)
--  2 En proceso
--  3 Completada
--  4 En espera
--  5 Cancelada
--  6 Bloqueada

-- Prioridad de las subtareas:
-- 1 Normal     (Default)
-- 2 Prioritario 
-- 3 Muy Prioritario 