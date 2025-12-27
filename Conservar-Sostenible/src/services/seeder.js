// src/database/seeder.js
const bcrypt = require('bcryptjs');
const db = require('./config');

async function seedDatabase() {
    console.log(' Iniciando inserción de datos iniciales...\n');

    try {
        // 1. Insertar usuarios
        console.log('👥 Insertando usuarios...');
        
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const users = [
            {
                username: 'admin',
                email: 'admin@conservar.com',
                password: hashedPassword,
                full_name: 'Administrador Principal',
                role: 'admin'
            },
            {
                username: 'cliente1',
                email: 'cliente@ejemplo.com',
                password: await bcrypt.hash('cliente123', 10),
                full_name: 'Cliente Ejemplo',
                role: 'user'
            }
        ];

        for (const user of users) {
            await db.query(
                `INSERT INTO users (username, email, password, full_name, role, created_at) 
                 VALUES ($1, $2, $3, $4, $5, NOW())
                 ON CONFLICT (email) DO NOTHING`,
                [user.username, user.email, user.password, user.full_name, user.role]
            );
        }
        console.log(' Usuarios insertados\n');

        // 2. Insertar productos/destinos
        console.log(' Insertando destinos turísticos...');
        
        const products = [
            {
                name: 'Montañas Verdes',
                description: 'Naturaleza en su máximo esplendor. Disfruta de senderos increíbles, aire puro y vistas panorámicas que te dejarán sin aliento.',
                price: 150.00,
                category: 'Aventura',
                location: 'Andes, Colombia',
                image_url: '/img/destino1.jpg',
                is_featured: true
            },
            {
                name: 'Playas Cristalinas',
                description: 'Arena blanca y aguas turquesas. Relájate en playas paradisíacas con el sonido del mar y paisajes tropicales únicos.',
                price: 200.00,
                category: 'Playa',
                location: 'San Andrés, Colombia',
                image_url: '/img/destino2.jpg',
                is_featured: true
            },
            {
                name: 'Selva Amazónica',
                description: 'Biodiversidad única en el mundo. Explora la selva tropical más grande del planeta con su flora y fauna excepcional.',
                price: 250.00,
                category: 'Ecoturismo',
                location: 'Amazonas, Brasil',
                image_url: '/img/destino3.jpg',
                is_featured: true
            },
            {
                name: 'Desierto Mágico',
                description: 'Paisajes áridos llenos de vida y colores. Experiencia única bajo las estrellas en medio de dunas interminables.',
                price: 180.00,
                category: 'Aventura',
                location: 'Tatacoa, Colombia',
                image_url: '/img/destino4.jpg',
                is_featured: false
            },
            {
                name: 'Cascadas Escondidas',
                description: 'Agua pura cayendo desde las alturas. Descubre cascadas secretas en medio de la selva con piscinas naturales.',
                price: 120.00,
                category: 'Naturaleza',
                location: 'Salento, Colombia',
                image_url: '/img/destino5.jpg',
                is_featured: true
            },
            {
                name: 'Ciudades Ancestrales',
                description: 'Cultura e historia viva. Recorre ciudades coloniales que conservan su arquitectura y tradiciones centenarias.',
                price: 170.00,
                category: 'Cultural',
                location: 'Cartagena, Colombia',
                image_url: '/img/destino6.jpg',
                is_featured: true
            }
        ];

        for (const product of products) {
            await db.query(
                `INSERT INTO products (name, description, price, category, location, image_url, is_featured, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
                 ON CONFLICT (name) DO NOTHING`,
                [product.name, product.description, product.price, product.category, 
                 product.location, product.image_url, product.is_featured]
            );
        }
        console.log(' Destinos turísticos insertados\n');

        // 3. Insertar imágenes del carrusel
        console.log(' Configurando carrusel de imágenes...');
        
        const carouselImages = [
            {
                image_url: '/img/destino1.jpg',
                title: 'Montañas Verdes',
                description: 'Descubre la naturaleza en su máximo esplendor',
                display_order: 1,
                is_active: true
            },
            {
                image_url: '/img/destino2.jpg',
                title: 'Playas Cristalinas',
                description: 'Relájate en aguas turquesas y arena blanca',
                display_order: 2,
                is_active: true
            },
            {
                image_url: '/img/destino3.jpg',
                title: 'Selva Amazónica',
                description: 'Explora la biodiversidad más grande del mundo',
                display_order: 3,
                is_active: true
            },
            {
                image_url: '/img/destino4.jpg',
                title: 'Desierto Mágico',
                description: 'Vive una experiencia única bajo las estrellas',
                display_order: 4,
                is_active: true
            },
            {
                image_url: '/img/destino5.jpg',
                title: 'Cascadas Escondidas',
                description: 'Descubre paraísos naturales escondidos',
                display_order: 5,
                is_active: true
            },
            {
                image_url: '/img/destino6.jpg',
                title: 'Ciudades Ancestrales',
                description: 'Sumérgete en la historia y cultura',
                display_order: 6,
                is_active: true
            }
        ];

        for (const image of carouselImages) {
            await db.query(
                `INSERT INTO carousel_images (image_url, title, description, display_order, is_active, created_at)
                 VALUES ($1, $2, $3, $4, $5, NOW())
                 ON CONFLICT DO NOTHING`,
                [image.image_url, image.title, image.description, 
                 image.display_order, image.is_active]
            );
        }
        console.log(' Carrusel configurado\n');

        // 4. Insertar contactos de ejemplo
        console.log(' Insertando contactos de ejemplo...');
        
        const contacts = [
            {
                name: 'Carlos López',
                email: 'carlos@email.com',
                subject: 'Consulta sobre paquetes familiares',
                message: 'Me gustaría información sobre los paquetes familiares disponibles para las vacaciones de mitad de año.',
                status: 'replied'
            },
            {
                name: 'Ana Martínez',
                email: 'ana@email.com',
                subject: 'Reserva grupal',
                message: 'Quisiera reservar para un grupo de 15 personas en el mes de diciembre. ¿Tienen disponibilidad?',
                status: 'pending'
            },
            {
                name: 'Roberto Fernández',
                email: 'roberto@email.com',
                subject: 'Información sobre turismo sostenible',
                message: 'Me interesa conocer más sobre sus prácticas de turismo sostenible y cómo puedo contribuir.',
                status: 'read'
            }
        ];

        for (const contact of contacts) {
            await db.query(
                `INSERT INTO contacts (name, email, subject, message, status, created_at)
                 VALUES ($1, $2, $3, $4, $5, NOW() - INTERVAL '${Math.floor(Math.random() * 30)} days')`,
                [contact.name, contact.email, contact.subject, contact.message, contact.status]
            );
        }
        console.log(' Contactos insertados\n');

        // 5. Verificar datos insertados
        console.log('🔍 Verificando datos insertados...\n');
        
        const tables = ['users', 'products', 'carousel_images', 'contacts'];
        
        for (const table of tables) {
            const result = await db.query(`SELECT COUNT(*) as count FROM ${table}`);
            console.log(`   ${table}: ${result.rows[0].count} registros`);
        }

        console.log('\n ¡Datos iniciales insertados exitosamente!');
        console.log('\n Credenciales de acceso:');
        console.log('    Administrador:');
        console.log('      Email: admin@conservar.com');
        console.log('      Contraseña: admin123');
        console.log('\n   👤 Cliente:');
        console.log('      Email: cliente@ejemplo.com');
        console.log('      Contraseña: cliente123');
        console.log('\n Accede a: http://localhost:3000\n');

    } catch (error) {
        console.error('Error insertando datos:', error.message);
        process.exit(1);
    }
}

seedDatabase();