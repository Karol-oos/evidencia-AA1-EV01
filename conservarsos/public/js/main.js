// ===== SWIPER CARRUSEL =====
document.addEventListener('DOMContentLoaded', function() {
  // Verificar si Swiper está disponible
  if (typeof Swiper !== 'undefined') {
    const swiper = new Swiper(".myswiper", {
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      slidesPerView: 3,
      spaceBetween: 20,
      centeredSlides: true,
      grabCursor: true,
      speed: 800,
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        }
      }
    });

    // ===== AMPLIAR IMG =====
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.querySelector(".modal-close");

    // Seleccionar imágenes del carrusel
    const images = document.querySelectorAll(".swiper-slide img");

    images.forEach((img) => {
      img.addEventListener("click", () => {
        if (modal && modalImg) {
          modal.style.display = "block";
          modalImg.src = img.src;
          modalImg.alt = img.alt;
        }
      });
    });

    // Cerrar modal
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        if (modal) modal.style.display = "none";
      });
    }

    // Cerrar al hacer clic fuera
    window.addEventListener("click", (e) => {
      if (modal && e.target === modal) {
        modal.style.display = "none";
      }
    });
  }
});

// ===== MODAL LOGIN =====
const loginBtn = document.getElementById("login-btn");
const loginModal = document.getElementById("login-modal");
const loginClose = document.querySelector(".login-close");

if (loginBtn && loginModal) {
  // Abrir modal
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.style.display = "flex";
  });

  // Cerrar modal
  if (loginClose) {
    loginClose.addEventListener("click", () => {
      loginModal.style.display = "none";
    });
  }

  // Cerrar al hacer clic fuera
  window.addEventListener("click", (e) => {
    if (e.target === loginModal) {
      loginModal.style.display = "none";
    }
  });
}

// ===== TABS LOGIN/REGISTER =====
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

if (tabBtns.length > 0) {
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remover clase active de todos
      tabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      // Activar seleccionado
      btn.classList.add("active");
      const tabContent = document.getElementById(`${btn.dataset.tab}-form`);
      if (tabContent) {
        tabContent.classList.add("active");
      }
    });
  });
}

// ===== FORMULARIO DE REGISTRO =====
const registerForm = document.getElementById("register-form");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Obtener valores CORREGIDOS (nombre, email, password)
    const nombre = registerForm.querySelector('input[name="nombre"]')?.value;
    const email = registerForm.querySelector('input[name="email"]')?.value;
    const password = registerForm.querySelector('input[name="password"]')?.value;
    const confirmPassword = registerForm.querySelector('input[name="confirmPassword"]')?.value;

    // Validación
    if (!nombre || !email || !password || !confirmPassword) {
      showAlert("Todos los campos son obligatorios", "error");
      return;
    }

    if (!validateEmail(email)) {
      showAlert("Por favor ingresa un email válido", "error");
      return;
    }

    if (password !== confirmPassword) {
      showAlert("Las contraseñas no coinciden", "error");
      return;
    }

    if (password.length < 6) {
      showAlert("La contraseña debe tener al menos 6 caracteres", "error");
      return;
    }

    // Mostrar carga
    const submitBtn = registerForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
    submitBtn.disabled = true;

    // Datos para enviar (usando 'nombre' en lugar de 'name')
    const formData = {
      nombre: nombre,      // ← CORREGIDO: 'nombre' en lugar de 'name'
      email: email,
      password: password
    };

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (response.ok) {
        showAlert("¡Registro exitoso! Ahora puedes iniciar sesión", "success");
        
        // Cambiar a pestaña de login automáticamente
        const loginTab = document.querySelector('[data-tab="login"]');
        if (loginTab) {
          loginTab.click();
          // Prellenar email en login
          const loginEmail = loginForm?.querySelector('input[name="email"]');
          if (loginEmail) loginEmail.value = email;
        }
        
        // Limpiar formulario
        registerForm.reset();
      } else {
        showAlert("Error: " + (result.message || result.error || "Error en el registro"), "error");
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      showAlert("Error de conexión. Verifica que el servidor esté ejecutándose", "error");
    } finally {
      // Restaurar botón
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ===== FORMULARIO DE LOGIN =====
const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = loginForm.querySelector('input[name="email"]')?.value;
    const password = loginForm.querySelector('input[name="password"]')?.value;

    if (!email || !password) {
      showAlert("Email y contraseña son obligatorios", "error");
      return;
    }

    if (!validateEmail(email)) {
      showAlert("Por favor ingresa un email válido", "error");
      return;
    }

    // Mostrar carga
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
    submitBtn.disabled = true;

    const formData = {
      email: email,
      password: password
    };

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (response.ok) {
        showAlert("¡Inicio de sesión exitoso!", "success");
        
        // Guardar token en localStorage
        if (result.token) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
        }
        
        // Cerrar modal de login
        if (loginModal) {
          setTimeout(() => {
            loginModal.style.display = "none";
          }, 1000);
        }
        
        // Actualizar interfaz
        updateUIAfterLogin(result.user);
        
        // Limpiar formulario
        loginForm.reset();
        
        // Recargar página después de 1.5 segundos
        setTimeout(() => {
          location.reload();
        }, 1500);
        
      } else {
        showAlert("Error: " + (result.message || result.error || "Credenciales incorrectas"), "error");
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      showAlert("Error de conexión con el servidor", "error");
    } finally {
      // Restaurar botón
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ===== FUNCIÓN PARA ACTUALIZAR INTERFAZ DESPUÉS DE LOGIN =====
function updateUIAfterLogin(user) {
  // Cambiar botón de login por nombre de usuario
  const loginBtn = document.getElementById("login-btn");
  if (loginBtn && user) {
    loginBtn.innerHTML = `
      <i class="fas fa-user"></i>
      ${user.nombre || user.name}  <!-- ← CORREGIDO: usa 'nombre' o 'name' -->
    `;
    loginBtn.style.pointerEvents = "none";
    loginBtn.style.cursor = "default";
    
    // Agregar botón de logout si no existe
    if (!document.getElementById("logout-btn")) {
      const logoutBtn = document.createElement("a");
      logoutBtn.href = "#";
      logoutBtn.id = "logout-btn";
      logoutBtn.className = "logout-btn";
      logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Cerrar Sesión';
      logoutBtn.style.marginLeft = "10px";
      logoutBtn.style.cursor = "pointer";
      
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        location.reload();
      });
      
      loginBtn.parentNode.appendChild(logoutBtn);
    }
  }
}

// ===== VERIFICAR SI YA HAY SESIÓN AL CARGAR LA PÁGINA =====
document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    try {
      const userData = JSON.parse(user);
      updateUIAfterLogin(userData);
    } catch (error) {
      console.error("Error al parsear datos de usuario:", error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});

// ===== FUNCIONES AUXILIARES =====

// Función para mostrar alertas personalizadas
function showAlert(message, type = "info") {
  // Eliminar alerta anterior si existe
  const existingAlert = document.querySelector('.custom-alert');
  if (existingAlert) existingAlert.remove();
  
  // Crear alerta
  const alert = document.createElement('div');
  alert.className = `custom-alert ${type}`;
  alert.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">&times;</button>
  `;
  
  // Estilos para la alerta
  alert.style.position = 'fixed';
  alert.style.top = '20px';
  alert.style.right = '20px';
  alert.style.padding = '15px 20px';
  alert.style.borderRadius = '5px';
  alert.style.zIndex = '9999';
  alert.style.display = 'flex';
  alert.style.justifyContent = 'space-between';
  alert.style.alignItems = 'center';
  alert.style.minWidth = '300px';
  alert.style.maxWidth = '400px';
  alert.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  alert.style.animation = 'fadeIn 0.3s ease';
  
  // Colores según tipo
  if (type === 'success') {
    alert.style.backgroundColor = '#d4edda';
    alert.style.color = '#155724';
    alert.style.border = '1px solid #c3e6cb';
  } else if (type === 'error') {
    alert.style.backgroundColor = '#f8d7da';
    alert.style.color = '#721c24';
    alert.style.border = '1px solid #f5c6cb';
  } else {
    alert.style.backgroundColor = '#d1ecf1';
    alert.style.color = '#0c5460';
    alert.style.border = '1px solid #bee5eb';
  }
  
  // Animación de entrada
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(alert);
  
  // Auto-eliminar después de 5 segundos
  setTimeout(() => {
    if (alert.parentElement) {
      alert.style.opacity = '0';
      alert.style.transform = 'translateY(-20px)';
      alert.style.transition = 'all 0.3s ease';
      setTimeout(() => alert.remove(), 300);
    }
  }, 5000);
}

// Función para validar email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Función para probar conexión con la API
async function testAPIConnection() {
  try {
    const response = await fetch('http://localhost:3000/api');
    if (response.ok) {
      console.log('✅ API conectada correctamente');
      return true;
    }
  } catch (error) {
    console.warn('⚠️ No se pudo conectar con la API');
    return false;
  }
}

// Probar conexión al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(testAPIConnection, 1000);
});