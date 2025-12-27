// ===== CONFIGURACIÓN DEL CARRUSEL =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Swiper para carrusel manual
    initSwiper();
    
    // Inicializar rotación automática del héroe
    initHeroRotation();
    
    // Configurar modales
    initModals();
    
    // Configurar formularios
    initForms();
    
    // Configurar navegación móvil
    initMobileNav();
    
    // Cargar estado inicial del carrusel
    loadCarouselState();
});

// ===== SWIPER (CARRUSEL MANUAL) =====
function initSwiper() {
    const swiper = new Swiper('.myswiper', {
        // Configuración básica
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        
        // Navegación
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // Paginación
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        
        // Efectos
        effect: 'slide',
        speed: 800,
        
        // Responsive
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
        }
    });
    
    // Agregar eventos para modal de imagen ampliada
    swiper.on('click', function(swiper, event) {
        const clickedSlide = swiper.clickedSlide;
        if (clickedSlide) {
            const img = clickedSlide.querySelector('img');
            const caption = clickedSlide.querySelector('.slide-caption');
            
            if (img) {
                openImageModal(img.src, 
                    caption ? caption.querySelector('h3').textContent : 'Destino Turístico',
                    caption ? caption.querySelector('p').textContent : '');
            }
        }
    });
    
    window.swiperInstance = swiper;
}

// ===== ROTACIÓN AUTOMÁTICA DEL HÉROE =====
let heroRotationInterval;
let heroCurrentIndex = 0;
let heroImages = [];
let isHeroRotating = true;

async function initHeroRotation() {
    try {
        // Cargar imágenes del héroe desde la API
        const response = await fetch('/api/images/all');
        const data = await response.json();
        
        if (data.success) {
            heroImages = data.images;
            
            // Iniciar rotación automática
            startHeroRotation();
            
            // Configurar controles manuales
            setupHeroControls();
            
            // Actualizar interfaz con estado inicial
            updateHeroUI();
        }
    } catch (error) {
        console.error('Error cargando imágenes del héroe:', error);
        // Usar imágenes por defecto si la API falla
        heroImages = [
            { image: '/img/destino1.jpg', title: 'Montañas Verdes', description: 'Naturaleza en su máximo esplendor' },
            { image: '/img/destino2.jpg', title: 'Playas Cristalinas', description: 'Arena blanca y aguas turquesas' },
            { image: '/img/destino3.jpg', title: 'Selva Amazónica', description: 'Biodiversidad única en el mundo' }
        ];
        startHeroRotation();
        setupHeroControls();
    }
}

function startHeroRotation() {
    // Detener rotación previa si existe
    if (heroRotationInterval) {
        clearInterval(heroRotationInterval);
    }
    
    // Obtener velocidad de rotación del backend
    fetch('/api/images/status')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const speed = data.rotationSpeed || 5000;
                isHeroRotating = data.isRotating || true;
                
                if (isHeroRotating) {
                    heroRotationInterval = setInterval(() => {
                        nextHeroImage();
                    }, speed);
                }
            }
        })
        .catch(() => {
            // Usar velocidad por defecto si la API falla
            heroRotationInterval = setInterval(() => {
                nextHeroImage();
            }, 5000);
        });
}

function nextHeroImage() {
    heroCurrentIndex = (heroCurrentIndex + 1) % heroImages.length;
    updateHeroImage();
    
    // Notificar al backend
    fetch('/api/images/next', { method: 'POST' })
        .catch(error => console.error('Error notificando cambio de imagen:', error));
}

function prevHeroImage() {
    heroCurrentIndex = (heroCurrentIndex - 1 + heroImages.length) % heroImages.length;
    updateHeroImage();
    
    // Notificar al backend
    fetch('/api/images/prev', { method: 'POST' })
        .catch(error => console.error('Error notificando cambio de imagen:', error));
}

function goToHeroImage(index) {
    if (index >= 0 && index < heroImages.length) {
        heroCurrentIndex = index;
        updateHeroImage();
        
        // Notificar al backend
        fetch(`/api/images/goto/${index}`, { method: 'POST' })
            .catch(error => console.error('Error notificando cambio de imagen:', error));
    }
}

function updateHeroImage() {
    const currentImage = heroImages[heroCurrentIndex];
    const heroSection = document.querySelector('.hero');
    
    if (heroSection && currentImage) {
        // Efecto de transición
        heroSection.style.opacity = '0.7';
        
        setTimeout(() => {
            // Cambiar imagen de fondo
            heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${currentImage.image}')`;
            
            // Actualizar contenido
            const heroContent = heroSection.querySelector('.hero-content');
            if (heroContent) {
                const title = heroContent.querySelector('h2');
                const description = heroContent.querySelector('p');
                
                if (title) title.textContent = currentImage.title;
                if (description) description.textContent = currentImage.description;
            }
            
            // Restaurar opacidad
            heroSection.style.opacity = '1';
        }, 300);
        
        // Actualizar indicadores
        updateHeroIndicators();
    }
}

function setupHeroControls() {
    // Crear controles si no existen
    let controlsContainer = document.querySelector('.hero-controls');
    
    if (!controlsContainer) {
        controlsContainer = document.createElement('div');
        controlsContainer.className = 'hero-controls';
        
        const controlsHTML = `
            <div class="hero-nav">
                <button class="hero-nav-btn prev" onclick="prevHeroImage()">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="hero-nav-btn next" onclick="nextHeroImage()">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <div class="hero-indicators">
                ${heroImages.map((_, index) => 
                    `<button class="hero-indicator ${index === 0 ? 'active' : ''}" 
                            onclick="goToHeroImage(${index})"></button>`
                ).join('')}
            </div>
            <div class="hero-rotation-controls">
                <button class="rotation-toggle" onclick="toggleHeroRotation()">
                    <i class="fas fa-pause"></i>
                </button>
                <div class="speed-control">
                    <input type="range" min="1000" max="10000" step="1000" 
                           value="5000" onchange="changeRotationSpeed(this.value)">
                    <span class="speed-display">5s</span>
                </div>
            </div>
        `;
        
        controlsContainer.innerHTML = controlsHTML;
        document.querySelector('.hero').appendChild(controlsContainer);
    }
}

function updateHeroIndicators() {
    const indicators = document.querySelectorAll('.hero-indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === heroCurrentIndex);
    });
}

function toggleHeroRotation() {
    isHeroRotating = !isHeroRotating;
    const toggleBtn = document.querySelector('.rotation-toggle i');
    
    if (isHeroRotating) {
        startHeroRotation();
        toggleBtn.className = 'fas fa-pause';
        showNotification('Rotación activada', 'success');
    } else {
        clearInterval(heroRotationInterval);
        heroRotationInterval = null;
        toggleBtn.className = 'fas fa-play';
        showNotification('Rotación pausada', 'info');
    }
    
    // Notificar al backend
    fetch('/api/images/rotation/toggle', { method: 'POST' })
        .catch(error => console.error('Error alternando rotación:', error));
}

function changeRotationSpeed(speed) {
    const speedDisplay = document.querySelector('.speed-display');
    const seconds = parseInt(speed) / 1000;
    speedDisplay.textContent = `${seconds}s`;
    
    // Notificar al backend
    fetch('/api/images/rotation/speed', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ speed: parseInt(speed) })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            if (isHeroRotating) {
                startHeroRotation(); // Reiniciar con nueva velocidad
            }
        }
    })
    .catch(error => console.error('Error cambiando velocidad:', error));
}

function updateHeroUI() {
    // Actualizar estado del botón de rotación
    const toggleBtn = document.querySelector('.rotation-toggle i');
    if (toggleBtn) {
        toggleBtn.className = isHeroRotating ? 'fas fa-pause' : 'fas fa-play';
    }
    
    // Actualizar velocidad en el control deslizante
    const speedInput = document.querySelector('.speed-control input');
    const speedDisplay = document.querySelector('.speed-display');
    
    if (speedInput && speedDisplay) {
        fetch('/api/images/status')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const speed = data.rotationSpeed || 5000;
                    speedInput.value = speed;
                    speedDisplay.textContent = `${speed / 1000}s`;
                }
            });
    }
}

async function loadCarouselState() {
    try {
        const response = await fetch('/api/images/current');
        const data = await response.json();
        
        if (data.success) {
            heroCurrentIndex = data.index;
            updateHeroImage();
            updateHeroUI();
        }
    } catch (error) {
        console.error('Error cargando estado del carrusel:', error);
    }
}

// ===== MODALES =====
function initModals() {
    // Modal de imagen ampliada
    const imageModal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const captionText = document.getElementById('caption');
    const modalClose = document.querySelector('.modal-close');
    
    if (imageModal && modalImg) {
        // Cerrar modal al hacer click en la X
        modalClose.onclick = function() {
            imageModal.style.display = "none";
        }
        
        // Cerrar modal al hacer click fuera de la imagen
        imageModal.onclick = function(event) {
            if (event.target === imageModal) {
                imageModal.style.display = "none";
            }
        }
        
        // Cerrar con Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && imageModal.style.display === 'block') {
                imageModal.style.display = "none";
            }
        });
    }
    
    // Modal de login
    const loginModal = document.getElementById('login-modal');
    const loginBtn = document.getElementById('login-btn');
    const loginClose = document.querySelector('.login-close');
    
    if (loginModal && loginBtn) {
        loginBtn.onclick = function(event) {
            event.preventDefault();
            loginModal.style.display = "block";
        }
        
        if (loginClose) {
            loginClose.onclick = function() {
                loginModal.style.display = "none";
            }
        }
        
        loginModal.onclick = function(event) {
            if (event.target === loginModal) {
                loginModal.style.display = "none";
            }
        }
        
        // Cambiar entre pestañas de login/registro
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.onclick = function() {
                const tab = this.getAttribute('data-tab');
                
                // Remover clase active de todos
                tabBtns.forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                // Agregar clase active al botón y contenido seleccionado
                this.classList.add('active');
                document.getElementById(`${tab}-form`).classList.add('active');
            }
        });
    }
}

function openImageModal(src, title, description) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const caption = document.getElementById('caption');
    
    if (modal && modalImg) {
        modal.style.display = "block";
        modalImg.src = src;
        modalImg.alt = title;
        caption.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
    }
}

// ===== FORMULARIOS =====
function initForms() {
    // Formulario de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = async function(event) {
            event.preventDefault();
            
            const formData = {
                email: document.getElementById('login-email').value,
                password: document.getElementById('login-password').value
            };
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showNotification('Inicio de sesión exitoso', 'success');
                    document.getElementById('login-modal').style.display = 'none';
                    // Actualizar UI para usuario logueado
                    updateUserUI(data.user);
                } else {
                    showNotification(data.message || 'Error en el login', 'error');
                }
            } catch (error) {
                showNotification('Error de conexión', 'error');
                console.error('Login error:', error);
            }
        };
    }
    
    // Formulario de registro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.onsubmit = async function(event) {
            event.preventDefault();
            
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                showNotification('Las contraseñas no coinciden', 'error');
                return;
            }
            
            const formData = {
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                password: password
            };
            
            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showNotification('Registro exitoso. Por favor inicia sesión.', 'success');
                    // Cambiar a pestaña de login
                    document.querySelector('[data-tab="login"]').click();
                    registerForm.reset();
                } else {
                    showNotification(data.message || 'Error en el registro', 'error');
                }
            } catch (error) {
                showNotification('Error de conexión', 'error');
                console.error('Register error:', error);
            }
        };
    }
}

// ===== NAVEGACIÓN MÓVIL =====
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Cerrar menú al hacer click en un enlace
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// ===== FUNCIONES UTILITARIAS =====
function showNotification(message, type = 'info') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 500px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Colores según tipo
    const colors = {
        success: '#4CAF50',
        error: '#F44336',
        info: '#2196F3',
        warning: '#FF9800'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Estilos CSS para animaciones
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

function updateUserUI(user) {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn && user) {
        loginBtn.innerHTML = `
            <i class="fas fa-user-check"></i> ${user.nombre || user.email}
        `;
        loginBtn.onclick = function(event) {
            event.preventDefault();
            // Mostrar menú de usuario
            showUserMenu();
        };
    }
}

function showUserMenu() {
    // Implementar menú de usuario desplegable
    showNotification('Menú de usuario - En desarrollo', 'info');
}

// Hacer funciones disponibles globalmente
window.openImageModal = openImageModal;
window.prevHeroImage = prevHeroImage;
window.nextHeroImage = nextHeroImage;
window.goToHeroImage = goToHeroImage;
window.toggleHeroRotation = toggleHeroRotation;
window.changeRotationSpeed = changeRotationSpeed;
window.showNotification = showNotification;