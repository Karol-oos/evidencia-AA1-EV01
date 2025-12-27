const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Configurar para servir archivos estáticos desde múltiples carpetas
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'img'))); // También servir desde /img
app.use('/public', express.static(path.join(__dirname, 'public'))); // Y desde /public

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Datos para el carrusel (simulado sin base de datos)
const carouselImages = [
    {
        id: 1,
        url: '/img/destino1.jpg',
        title: 'Montañas Verdes',
        description: 'Naturaleza en su máximo esplendor'
    },
    {
        id: 2, 
        url: '/img/destino2.jpg',
        title: 'Playas Cristalinas',
        description: 'Arena blanca y aguas turquesas'
    },
    {
        id: 3,
        url: '/img/destino3.jpg', 
        title: 'Selva Amazónica',
        description: 'Biodiversidad única en el mundo'
    },
    {
        id: 4,
        url: '/img/destino4.jpg',
        title: 'Cascadas Escondidas',
        description: 'Agua pura cayendo desde las alturas'
    },
    {
        id: 5,
        url: '/img/destino5.jpg',
        title: 'Ciudades Ancestrales',
        description: 'Cultura e historia viva'
    },
    {
        id: 6,
        url: '/img/destino6.jpg',
        title: 'Auroras Boreales',
        description: 'Luz natural espectacular'
    }
];

// API para obtener imágenes del carrusel
app.get('/api/images', (req, res) => {
    res.json({
        success: true,
        images: carouselImages,
        count: carouselImages.length
    });
});

// API para rotar imágenes (simulada)
app.get('/api/images/rotate', (req, res) => {
    // Rotar manualmente: mover la primera imagen al final
    carouselImages.push(carouselImages.shift());
    
    res.json({
        success: true,
        message: 'Imágenes rotadas',
        currentImage: carouselImages[0],
        images: carouselImages
    });
});

// Ruta principal - HTML dinámico
app.get('/', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Conservar Sostenible</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
            }
            
            /* Header */
            header {
                background-color: #2E7D32;
                color: white;
                padding: 1rem 2rem;
                position: fixed;
                width: 100%;
                top: 0;
                z-index: 1000;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .navbar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .logo h1 {
                font-size: 1.8rem;
                font-weight: bold;
            }
            
            .nav-menu {
                display: flex;
                list-style: none;
                gap: 1.5rem;
            }
            
            .nav-menu a {
                color: white;
                text-decoration: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                transition: background 0.3s;
            }
            
            .nav-menu a:hover {
                background-color: rgba(255,255,255,0.1);
            }
            
            .nav-menu a.active {
                background-color: rgba(255,255,255,0.2);
            }
            
            /* Hero Section */
            .hero {
                height: 80vh;
                background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/img/destino1.jpg');
                background-size: cover;
                background-position: center;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                color: white;
                padding: 0 1rem;
                margin-top: 70px;
                transition: background-image 1s ease-in-out;
            }
            
            .hero-content {
                max-width: 800px;
            }
            
            .hero h2 {
                font-size: 3rem;
                margin-bottom: 1rem;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            }
            
            .hero p {
                font-size: 1.2rem;
                margin-bottom: 2rem;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            }
            
            .btn-hero {
                display: inline-block;
                background-color: #FF9800;
                color: white;
                padding: 1rem 2.5rem;
                border-radius: 30px;
                text-decoration: none;
                font-weight: bold;
                font-size: 1.1rem;
                transition: all 0.3s;
            }
            
            .btn-hero:hover {
                background-color: #F57C00;
                transform: translateY(-3px);
                box-shadow: 0 10px 20px rgba(0,0,0,0.2);
            }
            
            /* Carrusel Section */
            .destinos {
                padding: 4rem 2rem;
                background-color: white;
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .destinos h2 {
                text-align: center;
                font-size: 2.5rem;
                color: #2E7D32;
                margin-bottom: 3rem;
            }
            
            .carousel-container {
                display: flex;
                gap: 20px;
                overflow-x: auto;
                padding: 20px;
                scrollbar-width: thin;
            }
            
            .carousel-item {
                flex: 0 0 auto;
                width: 300px;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                transition: transform 0.3s;
            }
            
            .carousel-item:hover {
                transform: translateY(-10px);
            }
            
            .carousel-item img {
                width: 100%;
                height: 200px;
                object-fit: cover;
                display: block;
            }
            
            .carousel-caption {
                padding: 1rem;
                background: white;
            }
            
            .carousel-caption h3 {
                color: #2E7D32;
                margin-bottom: 0.5rem;
            }
            
            .carousel-controls {
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-top: 2rem;
            }
            
            .carousel-btn {
                background-color: #2E7D32;
                color: white;
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 5px;
                cursor: pointer;
                font-size: 1rem;
                transition: background 0.3s;
            }
            
            .carousel-btn:hover {
                background-color: #1B5E20;
            }
            
            .rotation-controls {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
                margin-top: 1rem;
            }
            
            .rotation-btn {
                background-color: #FF9800;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 5px;
                cursor: pointer;
            }
            
            /* Footer */
            footer {
                background-color: #333;
                color: white;
                padding: 3rem 2rem 1rem;
                margin-top: 3rem;
            }
            
            .footer-content {
                max-width: 1200px;
                margin: 0 auto;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 2rem;
                margin-bottom: 2rem;
            }
            
            .footer-section h3 {
                font-size: 1.5rem;
                margin-bottom: 1rem;
                color: #4CAF50;
            }
            
            .social-icons {
                display: flex;
                gap: 15px;
                margin-top: 1rem;
            }
            
            .social-icons a {
                color: white;
                font-size: 1.5rem;
            }
            
            .footer-bottom {
                text-align: center;
                padding-top: 2rem;
                border-top: 1px solid #444;
                font-size: 0.9rem;
                color: #aaa;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .hero h2 {
                    font-size: 2rem;
                }
                
                .hero p {
                    font-size: 1rem;
                }
                
                .nav-menu {
                    display: none;
                }
                
                .carousel-item {
                    width: 250px;
                }
            }
        </style>
    </head>
    <body>
        <!-- Header -->
        <header>
            <nav class="navbar">
                <div class="logo">
                    <h1>CONSERVAR SOSTENIBLE</h1>
                </div>
                <ul class="nav-menu">
                    <li><a href="/" class="active">Inicio</a></li>
                    <li><a href="/servicios">Servicios</a></li>
                    <li><a href="/tienda">Tienda</a></li>
                    <li><a href="/reservaciones">Reservaciones</a></li>
                    <li><a href="/contacto">Contacto</a></li>
                    <li><a href="#" id="loginBtn">Iniciar Sesión</a></li>
                </ul>
            </nav>
        </header>

        <!-- Hero Section -->
        <section class="hero" id="heroSection">
            <div class="hero-content">
                <h2>TU MEJOR DESTINO PARA DISFRUTAR</h2>
                <p>Porque para CONSERVAR tu alegría necesitas disfrutar de la belleza de este mundo con sus diferentes sitios turísticos y sus ambientes acogedores. ¿Qué esperas?</p>
                <a href="#destinos" class="btn-hero" onclick="scrollToDestinos()">Explorar Destinos</a>
            </div>
        </section>

        <!-- Carrusel de Destinos -->
        <section class="destinos" id="destinos">
            <h2>Lugares Turísticos</h2>
            
            <div class="carousel-container" id="imageCarousel">
                <!-- Las imágenes se cargarán dinámicamente con JavaScript -->
            </div>
            
            <div class="carousel-controls">
                <button class="carousel-btn" onclick="prevImage()">← Anterior</button>
                <button class="carousel-btn" onclick="nextImage()">Siguiente →</button>
            </div>
            
            <div class="rotation-controls">
                <button class="rotation-btn" onclick="toggleRotation()" id="rotationBtn">⏸️ Pausar Rotación</button>
                <span>Velocidad: </span>
                <input type="range" min="1" max="10" value="5" id="speedSlider" onchange="changeSpeed()">
                <span id="speedValue">5s</span>
            </div>
        </section>

        <!-- Footer -->
        <footer>
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Conservar Sostenible</h3>
                    <p>Promoviendo el turismo responsable y sostenible.</p>
                </div>
                <div class="footer-section">
                    <h3>Contacto</h3>
                    <p> info@conservarsostenible.com</p>
                    <p> +57 123 456 7890</p>
                </div>
                <div class="footer-section">
                    <h3>Síguenos</h3>
                    <div class="social-icons">
                        <a href="#"></a>
                        <a href="#"></a>
                        <a href="#"></a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>© 2024 Conservar Sostenible. Todos los derechos reservados.</p>
            </div>
        </footer>

        <script>
            // Variables globales
            let carouselImages = [];
            let currentIndex = 0;
            let isRotating = true;
            let rotationInterval;
            let rotationSpeed = 5000; // 5 segundos
            
            // Cargar imágenes al iniciar
            document.addEventListener('DOMContentLoaded', function() {
                loadImages();
                startRotation();
            });
            
            // Cargar imágenes desde la API
            async function loadImages() {
                try {
                    const response = await fetch('/api/images');
                    const data = await response.json();
                    
                    if (data.success) {
                        carouselImages = data.images;
                        displayImages();
                    }
                } catch (error) {
                    console.error('Error cargando imágenes:', error);
                    // Usar imágenes por defecto si falla
                    carouselImages = [
                        {url: '/img/destino1.jpg', title: 'Montañas Verdes', description: 'Naturaleza en su máximo esplendor'},
                        {url: '/img/destino2.jpg', title: 'Playas Cristalinas', description: 'Arena blanca y aguas turquesas'},
                        {url: '/img/destino3.jpg', title: 'Selva Amazónica', description: 'Biodiversidad única en el mundo'},
                        {url: '/img/destino4.jpg', title: 'Cascadas Escondidas', description: 'Agua pura cayendo desde las alturas'},
                        {url: '/img/destino5.jpg', title: 'Ciudades Ancestrales', description: 'Cultura e historia viva'},
                        {url: '/img/destino6.jpg', title: 'Auroras Boreales', description: 'Luz natural espectacular'}
                    ];
                    displayImages();
                }
            }
            
            // Mostrar imágenes en el carrusel
            function displayImages() {
                const carousel = document.getElementById('imageCarousel');
                carousel.innerHTML = '';
                
                carouselImages.forEach((image, index) => {
                    const item = document.createElement('div');
                    item.className = 'carousel-item';
                    item.innerHTML = \`
                        <img src="\${image.url}" alt="\${image.title}" loading="lazy">
                        <div class="carousel-caption">
                            <h3>\${image.title}</h3>
                            <p>\${image.description}</p>
                        </div>
                    \`;
                    carousel.appendChild(item);
                });
            }
            
            // Rotación automática
            function startRotation() {
                if (rotationInterval) {
                    clearInterval(rotationInterval);
                }
                
                rotationInterval = setInterval(() => {
                    if (isRotating) {
                        rotateCarousel();
                    }
                }, rotationSpeed);
                
                updateRotationButton();
            }
            
            function rotateCarousel() {
                // Rotar manualmente usando la API
                fetch('/api/images/rotate')
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            carouselImages = data.images;
                            updateHeroImage(data.currentImage);
                        }
                    })
                    .catch(error => {
                        console.error('Error rotando imágenes:', error);
                        // Rotación local si falla la API
                        const firstImage = carouselImages.shift();
                        carouselImages.push(firstImage);
                        updateHeroImage(carouselImages[0]);
                    });
            }
            
            function updateHeroImage(image) {
                const heroSection = document.getElementById('heroSection');
                if (heroSection && image) {
                    heroSection.style.backgroundImage = \`linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('\${image.url}')\`;
                    
                    const heroContent = heroSection.querySelector('.hero-content');
                    if (heroContent) {
                        const title = heroContent.querySelector('h2');
                        const description = heroContent.querySelector('p');
                        
                        if (title) title.textContent = image.title;
                        if (description) description.textContent = image.description;
                    }
                }
            }
            
            // Controles manuales
            function prevImage() {
                // Mover la última imagen al principio
                const lastImage = carouselImages.pop();
                carouselImages.unshift(lastImage);
                updateHeroImage(carouselImages[0]);
                displayImages();
            }
            
            function nextImage() {
                // Mover la primera imagen al final
                const firstImage = carouselImages.shift();
                carouselImages.push(firstImage);
                updateHeroImage(carouselImages[0]);
                displayImages();
            }
            
            function toggleRotation() {
                isRotating = !isRotating;
                updateRotationButton();
            }
            
            function updateRotationButton() {
                const btn = document.getElementById('rotationBtn');
                if (isRotating) {
                    btn.innerHTML = ' Pausar Rotación';
                } else {
                    btn.innerHTML = ' Reanudar Rotación';
                }
            }
            
            function changeSpeed() {
                const slider = document.getElementById('speedSlider');
                const valueDisplay = document.getElementById('speedValue');
                
                rotationSpeed = (11 - slider.value) * 1000; // Invertir: 1=10s, 10=1s
                valueDisplay.textContent = \`\${rotationSpeed / 1000}s\`;
                
                if (isRotating) {
                    startRotation();
                }
            }
            
            function scrollToDestinos() {
                document.getElementById('destinos').scrollIntoView({
                    behavior: 'smooth'
                });
            }
            
            // Actualizar imagen del héroe cada 5 segundos
            setInterval(() => {
                if (isRotating) {
                    nextImage();
                }
            }, rotationSpeed);
        </script>
    </body>
    </html>
    `;
    
    res.send(html);
});

// Rutas adicionales (páginas estáticas)
app.get('/servicios', (req, res) => {
    res.send('<h1>Servicios - Próximamente</h1><a href="/">Volver al inicio</a>');
});

app.get('/tienda', (req, res) => {
    res.send('<h1>Tienda - Próximamente</h1><a href="/">Volver al inicio</a>');
});

app.get('/reservaciones', (req, res) => {
    res.send('<h1>Reservaciones - Próximamente</h1><a href="/">Volver al inicio</a>');
});

app.get('/contacto', (req, res) => {
    res.send('<h1>Contacto - Próximamente</h1><a href="/">Volver al inicio</a>');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
    ============================================
       CONSERVAR SOSTENIBLE - SERVIDOR ACTIVO
    ============================================
        URL: http://localhost:${PORT}
        Carrusel automático ACTIVADO
        Rotación cada 5 segundos
        Imágenes servidas desde: /img y /public
    ============================================
    `);
    
    // Verificar imágenes disponibles
    const fs = require('fs');
    const imgPath = path.join(__dirname, 'img');
    if (fs.existsSync(imgPath)) {
        const images = fs.readdirSync(imgPath).filter(file => 
            /\.(jpg|jpeg|png|gif)$/i.test(file)
        );
        console.log(` ${images.length} imágenes encontradas en /img/`);
        images.forEach(img => console.log(`   📸 ${img}`));
    } else {
        console.log('⚠️  Carpeta /img/ no encontrada');
    }
});