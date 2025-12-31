-- Insertar proveedores de prueba
INSERT INTO tbsuppliers (supplierNumber, firstName, lastName, phone, email, address, city, department, country, isActive, createdAt, updatedAt) VALUES
('SUP001', 'Juan', 'Pérez', '+591 77712345', 'juan.perez@email.com', 'Av. Principal 123', 'La Paz', 'La Paz', 'Bolivia', 1, datetime('now'), datetime('now')),
('SUP002', 'María', 'González', '+591 77723456', 'maria.gonzalez@email.com', 'Calle Comercio 456', 'Cochabamba', 'Cochabamba', 'Bolivia', 1, datetime('now'), datetime('now')),
('SUP003', 'Carlos', 'Rodríguez', '+591 77734567', 'carlos.rodriguez@email.com', 'Plaza Central 789', 'Santa Cruz', 'Santa Cruz', 'Bolivia', 1, datetime('now'), datetime('now'));

-- Asignar proveedores a managers (para que aparezcan en la lista)
INSERT INTO tbsupplier_managers (FK_supplier, FK_manager, assignedAt) VALUES
(1, 4, datetime('now')),
(2, 4, datetime('now')),
(3, 5, datetime('now'));