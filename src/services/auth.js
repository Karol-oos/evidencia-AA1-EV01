// Verificar autenticación en cualquier página
function requireAuth() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser'));
    const authToken = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
    
    if (!currentUser || !authToken) {
        window.location.href = 'login.html';
        return null;
    }
    
    return currentUser;
}

// Cerrar sesión
function logout() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('auth_token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('auth_token');
    window.location.href = 'login.html';
}

// Obtener usuario actual
function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser'));
}

// Verificar si es admin
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

// Validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validar contraseña
function isValidPassword(password) {
    return password && password.length >= 8;
}

// Generar avatar URL
function generateAvatarUrl(name) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2E7D32&color=fff`;
}

// Exportar funciones para usar en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        requireAuth,
        logout,
        getCurrentUser,
        isAdmin,
        isValidEmail,
        isValidPassword,
        generateAvatarUrl
    };
}