-- seeds.sql

-- Insertar usuario administrador
INSERT INTO users (username, email, password, full_name, role) 
VALUES 
('admin', 'admin@conservar.com', '$2b$10$YourHashedPasswordHere', 'Administrador', 'admin'),
('usuario1', 'cliente@ejemplo.com', '$2b$10$YourHashedPasswordHere', 'Cliente Ejemplo', 'user');

-- Insertar destinos turísticos (productos)
INSERT INTO products (name, description, price, category, location, image_url, is_featured) 
VALUES 
('Playa del Carmen', 'Hermosa playa con arena blanca y aguas cristalinas', 150.00, 'playa', 'Quintana Roo, México', '/images/playa-carmen.jpg', true),
('Machu Picchu', 'Antigua ciudad inca en las montañas de Perú', 200.00, 'cultural', 'Cusco, Perú', '/images/machu-picchu.jpg', true),
('Torres del Paine', 'Parque nacional con impresionantes montañas y glaciares', 180.00, 'aventura', 'Patagonia, Chile', '/images/torres-paine.jpg', true),
('Amazonas', 'Expedición por la selva tropical más grande del mundo', 250.00, 'aventura', 'Amazonas, Brasil', '/images/amazonas.jpg', true),
('Cartagena', 'Ciudad histórica con arquitectura colonial y playas', 120.00, 'cultural', 'Cartagena, Colombia', '/images/cartagena.jpg', false),
('Galápagos', 'Islas únicas con fauna endémica y paisajes volcánicos', 300.00, 'naturaleza', 'Galápagos, Ecuador', '/images/galapagos.jpg', true);

-- Insertar algunas consultas de contacto
INSERT INTO contacts (name, email, subject, message) 
VALUES 
('Carlos López', 'carlos@email.com', 'Consulta sobre paquetes', 'Me gustaría información sobre los paquetes familiares'),
('Ana Martínez', 'ana@email.com', 'Reserva grupal', 'Quisiera reservar para un grupo de 15 personas');

-- Insertar algunas reservaciones de ejemplo
INSERT INTO reservations (user_id, product_id, reservation_date, number_of_people, status) 
VALUES 
(2, 1, '2024-06-15', 2, 'confirmed'),
(2, 3, '2024-07-20', 4, 'pending');