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
