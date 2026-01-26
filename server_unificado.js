// server_unificado.js - SERVIDOR COMPLETO Y FUNCIONAL
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000; // O usa 5000 si prefieres

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configurar múltiples carpetas estáticas
const staticFolders = ['public', 'img', 'src/public', 'Conservar-Sostenible/src/public'];

staticFolders.forEach(folder => {
    const fullPath = path.join(__dirname, folder);
    if (fs.existsSync(fullPath)) {
        app.use(`/${folder}`, express.static(fullPath));
        console.log(`✅ Serviendo archivos estáticos desde: /${folder}`);
    }
});

// ================= RUTAS PRINCIPALES =================

// 1. PÁGINA PRINCIPAL CON CARRUSEL
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Conservar Sostenible</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
            header { background: #2E7D32; color: white; padding: 1rem; text-align: center; }
            .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
            .nav { display: flex; gap: 20px; justify-content: center; margin: 20px 0; }
            .nav a { color: #2E7D32; text-decoration: none; padding: 10px 20px; background: white; border-radius: 5px; }
            .carousel { display: flex; overflow-x: auto; gap: 20px; padding: 20px 0; }
            .carousel-item { min-width: 300px; background: white; border-radius: 10px; overflow: hidden; }
            .carousel-item img { width: 100%; height: 200px; object-fit: cover; }
            .footer { background: #333; color: white; text-align: center; padding: 2rem; margin-top: 3rem; }
        </style>
    </head>
    <body>
        <header>
            <h1>🌿 CONSERVAR SOSTENIBLE</h1>
            <p>Turismo responsable y sostenible</p>
        </header>
        
        <div class="container">
            <div class="nav">
                <a href="/">🏠 Inicio</a>
                <a href="/contacto">📧 Contacto</a>
                <a href="/servicios">🛠️ Servicios</a>
                <a href="/api">🔧 API</a>
            </div>
            
            <h2>Destinos Turísticos</h2>
            <div class="carousel" id="carousel">
                <!-- Imágenes se cargarán con JavaScript -->
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="/contacto" style="background: #FF9800; color: white; padding: 15px 30px; 
                   text-decoration: none; border-radius: 30px; display: inline-block;">
                    ✨ Explorar Destinos
                </a>
            </div>
        </div>
        
        <div class="footer">
            <p>© 2024 Conservar Sostenible - Puerto: ${PORT}</p>
            <p>✅ Servidor funcionando correctamente</p>
        </div>
        
        <script>
            // Datos de ejemplo para el carrusel
            const images = [
                {url: '/img/destino1.jpg', title: 'Montañas Verdes'},
                {url: '/img/destino2.jpg', title: 'Playas Cristalinas'},
                {url: '/img/destino3.jpg', title: 'Selva Amazónica'},
                {url: '/img/destino4.jpg', title: 'Cascadas Escondidas'}
            ];
            
            const carousel = document.getElementById('carousel');
            images.forEach(img => {
                const item = document.createElement('div');
                item.className = 'carousel-item';
                item.innerHTML = \`
                    <img src="\${img.url}" alt="\${img.title}" onerror="this.src='https://via.placeholder.com/300x200?text='+encodeURIComponent('\${img.title}')">
                    <div style="padding: 15px;">
                        <h3>\${img.title}</h3>
                    </div>
                \`;
                carousel.appendChild(item);
            });
        </script>
    </body>
    </html>
    `);
});

// 2. FORMULARIO DE CONTACTO COMPLETO
app.get('/contacto', (req, res) => {
    const contactoHTML = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contacto - Conservar Sostenible</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); min-height: 100vh; padding: 20px; }
            .container { max-width: 800px; margin: 40px auto; background: white; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(90deg, #2E7D32, #4CAF50); color: white; padding: 40px 30px; text-align: center; }
            .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
            .header p { font-size: 1.1rem; opacity: 0.9; }
            .form-container { padding: 40px; }
            .form-group { margin-bottom: 25px; }
            label { display: block; margin-bottom: 8px; font-weight: 600; color: #333; font-size: 1rem; }
            .required::after { content: " *"; color: #e53935; }
            input, textarea { width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 16px; transition: all 0.3s; font-family: inherit; }
            input:focus, textarea:focus { outline: none; border-color: #4CAF50; box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2); }
            textarea { min-height: 150px; resize: vertical; }
            .btn-submit { background: linear-gradient(90deg, #2E7D32, #4CAF50); color: white; border: none; padding: 18px 40px; font-size: 1.1rem; border-radius: 10px; cursor: pointer; width: 100%; font-weight: 600; letter-spacing: 0.5px; transition: all 0.3s; }
            .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 7px 14px rgba(76, 175, 80, 0.3); }
            .btn-submit:active { transform: translateY(0); }
            .back-link { display: inline-block; margin-top: 25px; color: #4CAF50; text-decoration: none; font-weight: 500; text-align: center; width: 100%; }
            .back-link:hover { text-decoration: underline; }
            .success-message { display: none; background: #4CAF50; color: white; padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: center; }
            .error-message { display: none; background: #e53935; color: white; padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: center; }
            @media (max-width: 600px) { .container { margin: 20px auto; } .header, .form-container { padding: 25px 20px; } }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📧 Contáctanos</h1>
                <p>¿Preguntas sobre turismo sostenible? Estamos aquí para ayudarte.</p>
            </div>
            
            <div class="form-container">
                <div class="success-message" id="successMsg">✅ ¡Mensaje enviado exitosamente! Te contactaremos pronto.</div>
                <div class="error-message" id="errorMsg">❌ Error al enviar el mensaje. Por favor intenta nuevamente.</div>
                
                <form id="contactForm">
                    <div class="form-group">
                        <label for="nombre" class="required">Nombre completo</label>
                        <input type="text" id="nombre" name="nombre" placeholder="Ej: Juan Pérez" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="email" class="required">Correo electrónico</label>
                        <input type="email" id="email" name="email" placeholder="Ej: juan@email.com" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="mensaje" class="required">Tu mensaje</label>
                        <textarea id="mensaje" name="mensaje" placeholder="Escribe tu mensaje aquí..." required></textarea>
                    </div>
                    
                    <button type="submit" class="btn-submit">📤 Enviar Mensaje</button>
                </form>
                
                <a href="/" class="back-link">← Volver al inicio</a>
            </div>
        </div>
        
        <script>
            document.getElementById('contactForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Mostrar estado de carga
                const submitBtn = this.querySelector('.btn-submit');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = '⏳ Enviando...';
                submitBtn.disabled = true;
                
                const formData = {
                    nombre: document.getElementById('nombre').value,
                    email: document.getElementById('email').value,
                    mensaje: document.getElementById('mensaje').value,
                    fecha: new Date().toLocaleString('es-ES'),
                    ip: '${req.ip}'
                };
                
                try {
                    const response = await fetch('/api/contacto', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        // Mostrar mensaje de éxito
                        document.getElementById('successMsg').style.display = 'block';
                        document.getElementById('errorMsg').style.display = 'none';
                        
                        // Limpiar formulario
                        document.getElementById('contactForm').reset();
                        
                        // Scroll al mensaje de éxito
                        document.getElementById('successMsg').scrollIntoView({ behavior: 'smooth' });
                    } else {
                        throw new Error(result.message || 'Error desconocido');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    document.getElementById('errorMsg').style.display = 'block';
                    document.getElementById('successMsg').style.display = 'none';
                    document.getElementById('errorMsg').textContent = '❌ ' + error.message;
                } finally {
                    // Restaurar botón
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            });
            
            // Validación en tiempo real
            const inputs = document.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('input', function() {
                    this.style.borderColor = this.checkValidity() ? '#4CAF50' : '#e0e0e0';
                });
            });
        </script>
    </body>
    </html>
    `;
    
    res.send(contactoHTML);
});

// 3. API PARA RECIBIR CONTACTO
app.post('/api/contacto', (req, res) => {
    console.log('='.repeat(50));
    console.log('📨 NUEVO MENSAJE DE CONTACTO RECIBIDO');
    console.log('='.repeat(50));
    console.log('👤 Nombre:', req.body.nombre);
    console.log('📧 Email:', req.body.email);
    console.log('💬 Mensaje:', req.body.mensaje);
    console.log('📅 Fecha:', req.body.fecha);
    console.log('🌐 IP:', req.body.ip);
    console.log('='.repeat(50));
    
    // Simular guardado en base de datos
    const mensajeGuardado = {
        id: Date.now(),
        ...req.body,
        estado: 'recibido',
        procesadoEn: new Date().toISOString()
    };
    
    res.json({
        success: true,
        message: 'Mensaje recibido exitosamente',
        data: mensajeGuardado,
        timestamp: new Date().toISOString(),
        instrucciones: {
            siguiente_paso: 'Revisaremos tu mensaje dentro de 24 horas',
            contacto: 'info@conservarsostenible.com'
        }
    });
});

// 4. API DE ESTADO
app.get('/api', (req, res) => {
    res.json({
        status: 'online',
        server: 'Conservar Sostenible',
        port: PORT,
        timestamp: new Date().toISOString(),
        endpoints: {
            home: '/',
            contacto: '/contacto',
            api_contacto: 'POST /api/contacto',
            servicios: '/servicios',
            tienda: '/tienda'
        },
        stats: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            node_version: process.version
        }
    });
});

// 5. OTRAS RUTAS BÁSICAS
app.get('/servicios', (req, res) => {
    res.send(`
        <div style="padding: 40px; text-align: center;">
            <h1 style="color: #2E7D32;">🛠️ Nuestros Servicios</h1>
            <p>Próximamente...</p>
            <a href="/" style="color: #4CAF50;">← Volver al inicio</a>
        </div>
    `);
});

app.get('/tienda', (req, res) => {
    res.send(`
        <div style="padding: 40px; text-align: center;">
            <h1 style="color: #2E7D32;">🛍️ Tienda Sostenible</h1>
            <p>Próximamente...</p>
            <a href="/" style="color: #4CAF50;">← Volver al inicio</a>
        </div>
    `);
});

// ================= INICIAR SERVIDOR =================
app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════════════════════╗
    ║      🌿 CONSERVAR SOSTENIBLE - SERVIDOR ACTIVO      ║
    ╠══════════════════════════════════════════════════════╣
    ║                                                      ║
    ║   ✅ SERVIDOR INICIADO CORRECTAMENTE                ║
    ║   🌐 URL: http://localhost:${PORT}                    ║
    ║   📧 Contacto: http://localhost:${PORT}/contacto      ║
    ║   🔧 API: http://localhost:${PORT}/api                ║
    ║                                                      ║
    ║   ⏰ ${new Date().toLocaleString('es-ES')}             ║
    ║                                                      ║
    ╚══════════════════════════════════════════════════════╝
    `);
    
    // Verificar carpetas importantes
    console.log('\n🔍 VERIFICANDO CARPETAS:');
    
    const carpetas = [
        { nombre: 'public', ruta: path.join(__dirname, 'public') },
        { nombre: 'img', ruta: path.join(__dirname, 'img') },
        { nombre: 'src/public', ruta: path.join(__dirname, 'src', 'public') }
    ];
    
    carpetas.forEach(carpeta => {
        if (fs.existsSync(carpeta.ruta)) {
            console.log(`   ✅ /${carpeta.nombre}/ - Detectada`);
            
            // Mostrar archivos en /img si existe
            if (carpeta.nombre === 'img') {
                const archivos = fs.readdirSync(carpeta.ruta)
                    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
                
                if (archivos.length > 0) {
                    console.log(`       📸 ${archivos.length} imagen(es) encontrada(s):`);
                    archivos.forEach(archivo => console.log(`         - ${archivo}`));
                }
            }
        } else {
            console.log(`   ⚠️  /${carpeta.nombre}/ - No encontrada (creando...)`);
            fs.mkdirSync(carpeta.ruta, { recursive: true });
        }
    });
    
    console.log('\n🚀 LISTO PARA USAR!');
    console.log('   Presiona Ctrl+C para detener el servidor\n');
});