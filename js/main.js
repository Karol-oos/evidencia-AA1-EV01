// ===== CONFIGURACIÓN INICIAL =====
document.addEventListener('DOMContentLoaded', function() {
    // Configurar modales
    initModals();
    
    // Configurar formularios
    initForms();
    
    // Configurar navegación móvil
    initMobileNav();
    
    // Cargar tabla de planes si estamos en administración
    if (document.getElementById('plansTableBody')) {
        loadPlansTable();
    }
    
    // Configurar botón de pago si existe
    if (document.getElementById('payButton')) {
        initPaymentButton();
    }
});

// ===== MODALES =====
function initModals() {
    // Modal de imagen ampliada
    const imageModal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalClose = document.querySelector('.modal-close');
    
    if (imageModal && modalImg) {
        // Cerrar modal al hacer click en la X
        if (modalClose) {
            modalClose.onclick = function() {
                imageModal.style.display = "none";
            }
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
    
    // Modal para planes (administración)
    const planModal = document.getElementById('planModal');
    if (planModal) {
        const planClose = planModal.querySelector('.close-modal');
        if (planClose) {
            planClose.onclick = function() {
                closePlanModal();
            }
        }
        
        // Cerrar modal al hacer click fuera
        planModal.onclick = function(event) {
            if (event.target === planModal) {
                closePlanModal();
            }
        }
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
            
            // Validación básica
            if (!formData.email || !formData.password) {
                showNotification('Por favor completa todos los campos', 'error');
                return;
            }
            
            try {
                showNotification('Procesando inicio de sesión...', 'info');
                
                // Simulación de API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Crear usuario simulado
                const mockUser = {
                    id: 'USR-' + Date.now(),
                    email: formData.email,
                    name: formData.email.split('@')[0],
                    role: formData.email.includes('admin') ? 'admin' : 'user'
                };
                
                // Guardar en localStorage
                localStorage.setItem('user', JSON.stringify(mockUser));
                localStorage.setItem('auth_token', 'mock-token-' + Date.now());
                
                showNotification('Inicio de sesión exitoso', 'success');
                
                // Cerrar modal y redirigir
                const loginModal = document.getElementById('login-modal');
                if (loginModal) loginModal.style.display = 'none';
                
                // Redirigir según rol
                setTimeout(() => {
                    if (mockUser.role === 'admin') {
                        window.location.href = 'administra.html';
                    } else {
                        window.location.href = 'dashboard.html';
                    }
                }, 1000);
                
            } catch (error) {
                showNotification('Error al iniciar sesión. Verifica tus credenciales.', 'error');
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
            
            // Validación básica
            if (!formData.nombre || !formData.email || !formData.password) {
                showNotification('Por favor completa todos los campos', 'error');
                return;
            }
            
            try {
                showNotification('Creando tu cuenta...', 'info');
                
                // Simulación de API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                showNotification('Registro exitoso. Por favor inicia sesión.', 'success');
                
                // Cambiar a pestaña de login
                const loginTab = document.querySelector('[data-tab="login"]');
                if (loginTab) loginTab.click();
                
                registerForm.reset();
                
            } catch (error) {
                showNotification('Error en el registro', 'error');
                console.error('Register error:', error);
            }
        };
    }
    
    // Formulario de plan (administración)
    const planForm = document.getElementById('planForm');
    if (planForm) {
        planForm.onsubmit = function(event) {
            event.preventDefault();
            
            const name = document.getElementById('planName').value;
            const destination = document.getElementById('planDestination').value;
            const price = document.getElementById('planPrice').value;
            
            if (!name || !destination || !price) {
                showNotification('Por favor completa todos los campos requeridos', 'error');
                return;
            }
            
            const newPlan = {
                id: Date.now(),
                name: name,
                destination: destination,
                price: parseFloat(price),
                status: 'active',
                createdAt: new Date().toISOString().split('T')[0]
            };
            
            let plans = JSON.parse(localStorage.getItem('plans') || '[]');
            plans.push(newPlan);
            localStorage.setItem('plans', JSON.stringify(plans));
            
            showNotification('✅ Plan creado exitosamente', 'success');
            loadPlansTable();
            closePlanModal();
            
            planForm.reset();
        };
    }
}

// ===== GESTIÓN DE PLANES (ADMINISTRACIÓN) =====
function loadPlansTable() {
    const plans = JSON.parse(localStorage.getItem('plans') || '[]');
    const tbody = document.getElementById('plansTableBody');
    
    if (!tbody) return;
    
    if (plans.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem; color: #666;">
                    <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <p>No hay planes creados todavía.</p>
                    <button class="btn btn-primary" onclick="openPlanModal()" 
                            style="margin-top: 1rem;">
                        <i class="fas fa-plus"></i> Crear primer plan
                    </button>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = plans.map(plan => `
        <tr>
            <td>${plan.name}</td>
            <td>${plan.destination}</td>
            <td>$${plan.price}</td>
            <td>
                <span class="status-badge ${plan.status === 'active' ? 'status-active' : 
                                         plan.status === 'inactive' ? 'status-cancelled' : 
                                         'status-pending'}">
                    ${plan.status === 'active' ? 'Activo' : 
                      plan.status === 'inactive' ? 'Inactivo' : 'Borrador'}
                </span>
            </td>
            <td>
                <button class="action-btn" onclick="editPlan(${plan.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deletePlan(${plan.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function deletePlan(id) {
    if (confirm('¿Estás seguro de eliminar este plan? Esta acción no se puede deshacer.')) {
        let plans = JSON.parse(localStorage.getItem('plans') || '[]');
        plans = plans.filter(p => p.id !== id);
        localStorage.setItem('plans', JSON.stringify(plans));
        loadPlansTable();
        showNotification('✅ Plan eliminado correctamente', 'success');
    }
}

function editPlan(id) {
    const plans = JSON.parse(localStorage.getItem('plans') || '[]');
    const plan = plans.find(p => p.id === id);
    
    if (plan) {
        // Llenar el modal con los datos del plan
        const nameInput = document.getElementById('planName');
        const destInput = document.getElementById('planDestination');
        const priceInput = document.getElementById('planPrice');
        
        if (nameInput && destInput && priceInput) {
            nameInput.value = plan.name;
            destInput.value = plan.destination;
            priceInput.value = plan.price;
            
            // Guardar el ID que estamos editando
            window.editingPlanId = id;
            
            // Cambiar título del modal
            const modalTitle = document.getElementById('planModalTitle');
            const submitBtn = document.getElementById('planSubmitBtn');
            
            if (modalTitle) modalTitle.textContent = 'Editar Plan';
            if (submitBtn) submitBtn.textContent = 'Actualizar Plan';
            
            // Modificar el comportamiento del formulario
            const planForm = document.getElementById('planForm');
            if (planForm) {
                planForm.onsubmit = function(event) {
                    event.preventDefault();
                    
                    const updatedPlan = {
                        id: window.editingPlanId,
                        name: nameInput.value,
                        destination: destInput.value,
                        price: parseFloat(priceInput.value),
                        status: plan.status,
                        createdAt: plan.createdAt
                    };
                    
                    let plans = JSON.parse(localStorage.getItem('plans') || '[]');
                    const index = plans.findIndex(p => p.id === window.editingPlanId);
                    
                    if (index !== -1) {
                        plans[index] = updatedPlan;
                        localStorage.setItem('plans', JSON.stringify(plans));
                        showNotification('✅ Plan actualizado correctamente', 'success');
                        loadPlansTable();
                        closePlanModal();
                        
                        // Restaurar el comportamiento original del formulario
                        planForm.onsubmit = function(e) {
                            e.preventDefault();
                            savePlan(e);
                        };
                    }
                };
            }
            
            openPlanModal();
        }
    }
}

function openPlanModal() {
    const modal = document.getElementById('planModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closePlanModal() {
    const modal = document.getElementById('planModal');
    if (modal) {
        modal.style.display = 'none';
        
        // Limpiar formulario
        const planForm = document.getElementById('planForm');
        if (planForm) {
            planForm.reset();
            
            // Restaurar comportamiento original
            planForm.onsubmit = function(event) {
                event.preventDefault();
                savePlan(event);
            };
        }
        
        // Restaurar título y botón
        const modalTitle = document.getElementById('planModalTitle');
        const submitBtn = document.getElementById('planSubmitBtn');
        
        if (modalTitle) modalTitle.textContent = 'Agregar Nuevo Plan';
        if (submitBtn) submitBtn.textContent = 'Guardar Plan';
        
        window.editingPlanId = null;
    }
}

function savePlan(event) {
    event.preventDefault();
    
    const name = document.getElementById('planName')?.value;
    const destination = document.getElementById('planDestination')?.value;
    const price = document.getElementById('planPrice')?.value;
    
    if (!name || !destination || !price) {
        showNotification('Por favor completa todos los campos requeridos', 'error');
        return;
    }
    
    const newPlan = {
        id: Date.now(),
        name: name,
        destination: destination,
        price: parseFloat(price),
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    let plans = JSON.parse(localStorage.getItem('plans') || '[]');
    plans.push(newPlan);
    localStorage.setItem('plans', JSON.stringify(plans));
    
    showNotification('✅ Plan creado exitosamente', 'success');
    loadPlansTable();
    closePlanModal();
}

// ===== PAGOS =====
function initPaymentButton() {
    const payButton = document.getElementById('payButton');
    if (payButton) {
        payButton.addEventListener('click', async function() {
            const button = this;
            const originalText = button.innerHTML;
            const email = document.getElementById('billingEmail')?.value;
            
            if (!email) {
                showAlert('❌ Por favor, ingresa un correo electrónico válido.', 'error');
                return;
            }

            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

            // Simulación de retraso de red
            setTimeout(() => {
                const transactionId = 'TX-' + Math.random().toString(36).substr(2, 9).toUpperCase();
                
                // Simulación de envío de email en consola
                console.log(`%c📧 EMAIL ENVIADO A: ${email}`, 'color: #2E7D32; font-weight: bold;');
                console.log(`Confirmación de reserva: ${transactionId}\nGracias por tu compromiso sostenible.`);

                showAlert('✅ ¡Pago procesado con éxito! Revisa tu email.', 'success');
                
                // Guardar registro
                const payments = JSON.parse(localStorage.getItem('payments') || '[]');
                payments.push({ 
                    email, 
                    transactionId, 
                    date: new Date().toISOString(),
                    amount: '300,000'
                });
                localStorage.setItem('payments', JSON.stringify(payments));

                setTimeout(() => {
                    window.location.href = `confirmation.html?tx=${transactionId}`;
                }, 2000);
            }, 2500);
        });
    }
}

function showAlert(message, type = 'info') {
    // Si existe un contenedor de alertas, usarlo
    const alertContainer = document.getElementById('paymentAlert') || document.getElementById('loginAlert');
    
    if (alertContainer) {
        alertContainer.textContent = message;
        alertContainer.className = `alert alert-${type}`;
        alertContainer.style.display = 'block';
        
        setTimeout(() => {
            alertContainer.style.display = 'none';
        }, 5000);
    } else {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = 'temp-notification';
        notification.innerHTML = `
            <div class="notification-content ${type}">
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
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

// ===== NOTIFICACIONES =====
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
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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

// ===== FUNCIONES GLOBALES =====
// Hacer funciones disponibles globalmente
window.openImageModal = openImageModal;
window.showNotification = showNotification;
window.loadPlansTable = loadPlansTable;
window.deletePlan = deletePlan;
window.editPlan = editPlan;
window.openPlanModal = openPlanModal;
window.closePlanModal = closePlanModal;

// ===== INICIALIZACIÓN DE DATOS =====
// Inicializar datos de planes si estamos en administración
if (window.location.pathname.includes('administra') || window.location.href.includes('administra')) {
    if (!localStorage.getItem('plans')) {
        const initialPlans = [
            {
                id: 1,
                name: "Eco-Lodge Amazonas",
                destination: "Amazonas",
                price: 120,
                status: "active",
                description: "Sumérgete en la selva amazónica con mínimo impacto ambiental",
                features: ["Energía Solar", "Reciclaje Total", "Comida Orgánica"],
                certifications: ["Biosphere Certified", "Rainforest Alliance"],
                createdAt: "2024-03-01"
            },
            {
                id: 2,
                name: "Camping Sierra Nevada",
                destination: "Andes",
                price: 65,
                status: "active",
                description: "Campamento ecológico en el corazón de la Sierra Nevada",
                features: ["Trekking", "Avistamiento de Aves", "Baños Secos"],
                certifications: ["Comunidad Local"],
                createdAt: "2024-03-02"
            }
        ];
        localStorage.setItem('plans', JSON.stringify(initialPlans));
    }
}