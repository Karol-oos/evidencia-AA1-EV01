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
    
    // Validación básica
    const name = registerForm.querySelector('input[name="name"]')?.value;
    const email = registerForm.querySelector('input[name="email"]')?.value;
    const password = registerForm.querySelector('input[name="password"]')?.value;
    const confirmPassword = registerForm.querySelector('input[name="confirmPassword"]')?.value;

    if (!name || !email || !password || !confirmPassword) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    const formData = {
      name: name,
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
        alert("¡Registro exitoso! Ahora puedes iniciar sesión");
        // Cambiar a pestaña de login automáticamente
        const loginTab = document.querySelector('[data-tab="login"]');
        if (loginTab) loginTab.click();
        
        // Limpiar formulario
        registerForm.reset();
      } else {
        alert("Error: " + (result.message || "Error en el registro"));
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      alert("Error de conexión. Verifica que el servidor esté ejecutándose en http://localhost:3000");
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
      alert("Email y contraseña son obligatorios");
      return;
    }

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
        alert("¡Login exitoso!");
        
        // Guardar token en localStorage
        if (result.token) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
        }
        
        // Cerrar modal
        if (loginModal) {
          loginModal.style.display = "none";
        }
        
        // Actualizar interfaz (mostrar nombre de usuario, etc.)
        updateUIAfterLogin(result.user);
        
        // Limpiar formulario
        loginForm.reset();
      } else {
        alert("Error: " + (result.message || "Credenciales incorrectas"));
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      alert("Error de conexión con el servidor");
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
      ${user.name}
    `;
    loginBtn.style.pointerEvents = "none";
    
    // Agregar botón de logout
    const logoutBtn = document.createElement("a");
    logoutBtn.href = "#";
    logoutBtn.id = "logout-btn";
    logoutBtn.className = "logout-btn";
    logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Cerrar Sesión';
    logoutBtn.style.marginLeft = "10px";
    
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      location.reload();
    });
    
    loginBtn.parentNode.appendChild(logoutBtn);
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