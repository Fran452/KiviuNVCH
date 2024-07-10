-- Ejemplos de inserción de datos

-- Insertar áreas
INSERT INTO Areas (power_Bi, nombre_del_Area) VALUES
('Power BI', 'Business Intelligence'),
('Marketing', 'Marketing Digital'),
('Ventas', 'Ventas');

-- Insertar puestos
INSERT INTO Puestos (nombre_puesto) VALUES
('Desarrollador Senior'),
('Especialista en SEO'),
('Gerente de Ventas');

-- Insertar empleados
INSERT INTO Empleados (fk_area, fk_puesto, nombre, contraseña, mail, sucursal) VALUES
(1, 1, 'Juan Pérez', 'password123', 'juan.perez@example.com', 'Ciudad de México'),
(2, 2, 'Ana Gómez', 'abc456', 'ana.gomez@example.com', 'Madrid'),
(3, 3, 'Carlos López', 'qwerty789', 'carlos.lopez@example.com', 'Buenos Aires'),
(1, 1, 'Francisco Lema', '$2b$16$3LvhCzCPQm.eenIQkZGk/uT8fwtDE4QPsg1RzLhrKzM9HTrGhlpTq', 'franciscolemacr@gmail.com', 'Buenos Aires');

-- Insertar indicadores
INSERT INTO Indicador (fk_area, fk_responsable, fk_responsable_suplente, nombre_indicador, recordatorio) VALUES
(1, 1, 2, 'Índice de satisfacción del cliente', '2024-07-08 10:00:00'),
(2, 2, 1, 'Tasa de conversión de ventas', '2024-07-09 14:30:00');

-- Insertar métricas
INSERT INTO Metrica (fk_indicador, dato_metrica, fecha_metrica, hora_metrica) VALUES
(1, 85, '2024-07-08', '09:00:00'),
(1, 82, '2024-07-09', '09:30:00'),
(2, 25, '2024-07-08', '10:00:00'),
(2, 27, '2024-07-09', '10:30:00');

-- Insertar tareas
INSERT INTO Tareas (fk_empleado_asignado, fk_area, nombre, rango, prioridad, fecha_inicio, fecha_final, notas) VALUES
(1, 1, 'Desarrollar nueva funcionalidad', 1, 1, '2024-07-08', '2024-07-15', 'Revisar diseño con equipo técnico'),
(1, 1, 'Optimizar base de datos', 2, 2, '2024-07-10', '2024-07-20', 'Priorizar índices para mejor rendimiento');

-- Insertar subtareas
INSERT INTO Subtareas (fk_tarea, fk_empleado_asignado, nombre, rango, prioridad, fecha_inicio, fecha_final, notas) VALUES
(1, 1, 'Implementar front-end', 1, 1, '2024-07-08', '2024-07-10', 'Usar framework React'),
(1, 1, 'Optimizar queries SQL', 2, 2, '2024-07-12', '2024-07-15', 'Revisar índices y estructuras de consultas'),
(2, 1, 'Revisar tablas críticas', 1, 1, '2024-07-11', '2024-07-12', 'Identificar tablas con mayor carga de datos');

-- Insertar empresas
INSERT INTO Empresas (nombre_de_la_empresa) VALUES
('Empresa A'),
('Empresa B'),
('Empresa C');

-- Insertar relaciones entre empresas y áreas
INSERT INTO Area_empresa (fk_empresa, fk_area) VALUES
(1, 1), -- Asignación del área de Desarrollo a la Empresa A
(2, 2); -- Asignación del área de Marketing a la Empresa B



INSERT INTO Areas (power_Bi, nombre_del_Area) VALUES ('Versión 1.0', 'Finanzas'), ('Versión 2.0', 'Recursos Humanos'), ('Versión 3.0', 'Ventas');
INSERT INTO Puestos (nombre_puesto) VALUES ('Gerente'), ('Analista'), ('Asistente');
INSERT INTO Empleados (fk_area, fk_puesto, nombre, contraseña, mail, sucursal) VALUES (1, 1, 'Juan Pérez', 'password123', 'juan@example.com', 'Oficina Principal'), (2, 2, 'María García', 'securepwd', 'maria@example.com', 'Sucursal A'), (3, 3, 'Pedro Martínez', 'passw0rd', 'pedro@example.com', 'Sucursal B'),(1, 1, 'Francisco Lema', '$2b$16$3LvhCzCPQm.eenIQkZGk/uT8fwtDE4QPsg1RzLhrKzM9HTrGhlpTq', 'franciscolemacr@gmail.com', 'Buenos Aires');
INSERT INTO Indicador (fk_area, fk_responsable, fk_responsable_sumplente, nombre_indicador, detalles_metrica, recordartorio) VALUES (1, 1, 2, 'Ventas Mensuales', 'Número de ventas realizadas cada mes', '2023-01-01'), (2, 3, 1, 'Índice de Rotación', 'Porcentaje de rotación de empleados', '2023-01-01');
INSERT INTO Metrica (fk_indicador, dato_metrica, fecha_Metrica, hora_Metrica, log_de_usuario) VALUES (1, 150, '2023-01-01', '09:00:00', 1), (2, 15, '2023-01-01', '09:00:00', 2);
INSERT INTO Tareas (fk_empleado_asignado, fK_area, nombre, rango, prioridad, fecha_inicio, fecha_final, notas) VALUES (1, 1, 'Preparar informe financiero', 1, 1, '2023-01-01', '2023-01-10', 'Revisar con detalle'), (2, 2, 'Entrevistas de selección', 1, 2, '2023-01-05', '2023-01-15', 'Confirmar citas');
INSERT INTO Subtareas (fk_tarea, fk_empleado_asignado, nombre, rango, prioridad, fecha_inicio, fecha_final, notas) VALUES (1, 1, 'Revisar balances', 1, 1, '2023-01-05', '2023-01-07', 'Comprobar cifras'), (2, 2, 'Entrevista candidato A', 1, 2, '2023-01-10', '2023-01-12', 'Evaluar habilidades');
INSERT INTO Empresas (nombre_de_la_Empresa) VALUES ('ACME Corporation'), ('Globex Corporation'), ('Wayne Enterprises');
INSERT INTO Area_empresa (fk_empresa, fk_area) VALUES (1, 1), (2, 2), (3, 3);
