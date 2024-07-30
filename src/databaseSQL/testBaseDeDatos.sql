INSERT INTO Areas (power_Bi, nombre_del_Area) VALUES ('Versión 1.0', 'Finanzas'), ('Versión 2.0', 'Recursos Humanos'), ('Versión 3.0', 'Ventas');
INSERT INTO Puestos (nombre_puesto) VALUES ('Gerente'), ('Analista'), ('Asistente');
INSERT INTO Empleados (fk_area, fk_puesto, nombre, password, mail, sucursal) VALUES (1, 1, 'Juan Pérez', 'password123', 'juan@example.com', 'Oficina Principal'), (2, 2, 'María García', 'securepwd', 'maria@example.com', 'Sucursal A'), (3, 3, 'Pedro Martínez', 'passw0rd', 'pedro@example.com', 'Sucursal B'),(1, 1, 'Francisco Lema', '$2b$16$3LvhCzCPQm.eenIQkZGk/uT8fwtDE4QPsg1RzLhrKzM9HTrGhlpTq', 'franciscolemacr@gmail.com', 'Buenos Aires');
INSERT INTO Tareas (fk_empleado_asignado, fK_area, nombre, estado, prioridad, fecha_inicio, fecha_final, notas) VALUES (1, 1, 'Preparar informe financiero', 1, 1, '2023-01-01', '2023-01-10', 'Revisar con detalle'), (2, 2, 'Entrevistas de selección', 1, 2, '2023-01-05', '2023-01-15', 'Confirmar citas');
INSERT INTO Indicadores (fk_area, fk_responsable, fk_responsable_suplente, nombre_indicador, detalles_metrica, recordatorio) VALUES (1, 1, 2, 'Ventas Mensuales', 'Número de ventas realizadas cada mes', '2023-01-01'), (2, 3, 1, 'Índice de Rotación', 'Porcentaje de rotación de empleados', '2023-01-01');
INSERT INTO Metricas (fk_indicador, dato_metrica, fecha_Metrica, hora_Metrica, log_de_usuario) VALUES (1, 150, '2023-01-01', '09:00:00', 1), (2, 15, '2023-01-01', '09:00:00', 2);
INSERT INTO Subtareas (fk_tarea, fk_empleado_asignado, nombre, rango, prioridad, fecha_inicio, fecha_final, notas) VALUES (1, 1, 'Revisar balances', 1, 1, '2023-01-05', '2023-01-07', 'Comprobar cifras'), (2, 2, 'Entrevista candidato A', 1, 2, '2023-01-10', '2023-01-12', 'Evaluar habilidades');
INSERT INTO Empresas (nombre_de_la_Empresa) VALUES ('ACME Corporation'), ('Globex Corporation'), ('Wayne Enterprises');
INSERT INTO Area_empresa (fk_empresa, fk_area) VALUES (1, 1), (2, 2), (3, 3);


-- Insertar una tarea asignada a un empleado en un área específica
INSERT INTO Tareas (fk_empleado_asignado, fk_area, fk_area_apoyo, nombre, estado, prioridad, fecha_inicio, fecha_final, notas, mostrar)
VALUES 
    (1, 101, 201, 'Revisión de informe mensual', 1, 2, '2024-07-23', '2024-07-30', 'Revisar el informe detalladamente', 1),
    (2, 102, 202, 'Desarrollo de nuevo módulo', 1, 1, '2024-08-01', '2024-08-15', 'Implementar funcionalidades solicitadas', 1),
    (3, 103, 203, 'Mantenimiento de base de datos', 1, 2, '2024-07-25', '2024-07-27', 'Realizar respaldo y optimización', 1),
    (4, 104, 204, 'Planificación de eventos trimestrales', 1, 1, '2024-08-01', '2024-08-10', 'Organizar detalles logísticos', 1),
    (5, 105, 205, 'Implementación de nuevas políticas', 1, 2, '2024-07-30', '2024-08-15', 'Actualizar manuales y procedimientos', 1),
    (6, 106, 206, 'Desarrollo de campaña publicitaria', 1, 1, '2024-08-05', '2024-08-25', 'Crear contenido y planificar difusión', 1);

---------------------------------- Base subida al server de ejemplo -----------------------

INSERT INTO Areas (power_Bi, nombre_del_Area) VALUES ('https://app.powerbi.com/view?r=eyJrIjoiOWY3YWE4NTctNzhiYi00MDU2LWFjNDYtOTZjNjAyYmFlOWRkIiwidCI6IjczNDA0NzgxLTBjNTUtNDVmNC04MDJkLTZlZDdkZTgxN2NkNSIsImMiOjR9', 'Recursos Humanos'), ('Versión 2.0', 'Finanzas'), ('Versión 3.0', 'Ventas');
INSERT INTO Puestos (nombre_puesto) VALUES ('Gerente'), ('Analista'), ('Asistente');
INSERT INTO Empleados (fk_area, fk_puesto, nombre, password, mail, sucursal) VALUES (1, 2, 'Francisco Lema', '$2b$16$3LvhCzCPQm.eenIQkZGk/uT8fwtDE4QPsg1RzLhrKzM9HTrGhlpTq', 'franciscolemacr@gmail.com', 'Buenos Aires');
INSERT INTO Tareas (fk_empleado_asignado, fk_area, fk_area_apoyo, nombre, estado, prioridad, fecha_inicio, fecha_final, notas, mostrar, progreso) VALUES (1, 1, 2, 'Tarea 1', 1, 3, '2024-07-01', '2024-08-01', 'Notas de la tarea 1', 1, 50), (1, 1, 2, 'Tarea 2', 2, 2, '2024-07-15', '2024-09-15', 'Notas de la tarea 2', 1, 30), (1, 1, 2, 'Tarea 3', 3, 1, '2024-07-20', '2024-08-30', 'Notas de la tarea 3', 0, 100);


INSERT INTO Empleados (fk_area, fk_puesto, nombre, password, mail, sucursal) VALUES (1, 2, 'Nombre Apellico', '$2b$16$3LvhCzCPQm.eenIQkZGk/uT8fwtDE4QPsg1RzLhrKzM9HTrGhlpTq', 'testUser@kiviu.com', 'Buenos Aires');
