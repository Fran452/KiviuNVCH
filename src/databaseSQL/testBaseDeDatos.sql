-- Insertar areas
INSERT INTO Areas (power_Bi, nombre_del_Area) VALUES 
('https://app.powerbi.com/view?r=eyJrIjoiOWY3YWE4NTctNzhiYi00MDU2LWFjNDYtOTZjNjAyYmFlOWRkIiwidCI6IjczNDA0NzgxLTBjNTUtNDVmNC04MDJkLTZlZDdkZTgxN2NkNSIsImMiOjR9', 'Recursos Humanos'), 
('Versión 2.0', 'Finanzas'), 
('Versión 3.0', 'Ventas');

-- Insertar puestos
INSERT INTO Puestos (nombre_puesto) VALUES 
('Gerente'), 
('Analista'), 
('Asistente');

-- Insertar empleados
INSERT INTO Empleados (fk_area, fk_puesto, nombre, password, mail, sucursal) VALUES 
(1, 2, 'Francisco Lema', '$2b$16$3LvhCzCPQm.eenIQkZGk/uT8fwtDE4QPsg1RzLhrKzM9HTrGhlpTq', 'franciscolemacr@gmail.com', 'Buenos Aires'),
(1, 2, 'Maria Sol Iturriza', '$2b$16$3LvhCzCPQm.eenIQkZGk/uT8fwtDE4QPsg1RzLhrKzM9HTrGhlpTq', 'iturrizams@globalhitss.com', 'Buenos Aires'),
(1, 2, 'Nombre Apellico', '$2b$16$3LvhCzCPQm.eenIQkZGk/uT8fwtDE4QPsg1RzLhrKzM9HTrGhlpTq', 'testUser@kiviu.com', 'Buenos Aires');


-- Insertar proyectos
INSERT INTO Proyectos (fk_area, nombre, detalles, ver) VALUES
(1, 'Desarrollo de Sistema de Gestión', 'Desarrollo de un sistema para la gestión de recursos humanos', 1),
(1, 'Implementación de CRM', 'Implementación de un sistema de gestión de relaciones con clientes', 2),
(1, 'Automatización de Reportes', 'Automatización de la generación de reportes financieros', 1);


-- Insertar tareas
INSERT INTO Tareas (fk_empleado_asignado, fk_area, fk_area_apoyo, nombre, fk_proyecto, estado, prioridad, fecha_inicio, fecha_final, notas, mostrar, progreso) VALUES
(1, 1, 1, 'Análisis de requerimientos del sistema de gestión', 1, 1, 1, '2024-08-01', '2024-08-15', 'Reunirse con el equipo de RRHH para definir necesidades', 1, 30),
(1, 1, 2, 'Diseño de base de datos para CRM', 2, 1, 2, '2024-08-10', '2024-09-05', 'Diseñar el esquema de la base de datos para el sistema CRM', 1, 10),
(1, 1, 2, 'Desarrollo del módulo de informes', 3, 2, 1, '2024-08-15', '2024-09-15', 'Desarrollar el módulo para generación de reportes', 1, 25),
(1, 1, 1, 'Pruebas de integración del sistema de gestión', 1, 2, 1, '2024-09-01', '2024-09-10', 'Realizar pruebas de integración con sistemas existentes', 1, 40),
(1, 1, 2, 'Configuración del CRM', 2, 2, 1, '2024-09-05', '2024-09-20', 'Configurar el sistema CRM según las especificaciones del cliente', 1, 20);


-- Indicadores
INSERT INTO Indicadores (fk_area, fk_responsable, fk_responsable_suplente, nombre_indicador, detalles_metrica, tipo_recordartorio, fecha_del_recodatorio, mostrar) VALUES
(1, 1, 2, 'Ventas Mensuales', 'Total de ventas realizadas en el mes', 1, '2024-08-15', 1),
(1, 1, 2, 'Campañas Publicitarias', 'Número de campañas lanzadas en el trimestre', 2, '2024-09-01', 1),
(1, 1, 2, 'Contrataciones Nuevas', 'Número de nuevas contrataciones en el mes', 1, '2024-08-31', 0);


-- Métricas
INSERT INTO Metricas (fk_indicador, dato_metrica, fecha_Metrica, hora_Metrica, log_de_usuario) VALUES
(1, 50000, '2024-08-01', '09:00:00', 1),
(1, 52000, '2024-08-02', '09:00:00', 1),
(1, 48000, '2024-08-03', '09:00:00', 1),
(2, 3, '2024-08-01', '10:00:00', 1),
(2, 2, '2024-08-02', '10:00:00', 1),
(2, 4, '2024-08-03', '10:00:00', 1),
(3, 5, '2024-08-01', '11:00:00', 1),
(3, 6, '2024-08-02', '11:00:00', 1),
(3, 4, '2024-08-03', '11:00:00', 1);