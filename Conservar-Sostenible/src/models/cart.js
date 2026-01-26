let shoppingCart = JSON.parse(localStorage.getItem('cart') || '[]');

function updateCartCount() {
    const countElement = document.getElementById('cartCount');
    if (countElement) {
        countElement.innerText = shoppingCart.length;
    }
}

function addToCart(planId) {
    const plan = mockPlans.find(p => p.id === planId);
    if (plan) {
        shoppingCart.push(plan);
        localStorage.setItem('cart', JSON.stringify(shoppingCart));
        updateCartCount();
        alert(`✅ ${plan.name} añadido al carrito`);
    }
}

// Mostrar mensaje "No se encontraron planes"
function renderExperiences(filteredPlans = mockPlans) {
    const container = document.getElementById('experiencesGrid');
    if (filteredPlans.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: #ccc;"></i>
                <h3 style="color: #666;">No se encontraron planes</h3>
                <p>Intenta con otros filtros.</p>
            </div>`;
        return;
    }
    // ... lógica existente para renderizar tarjetas ...
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    document.getElementById('cartIcon').addEventListener('click', (e) => {
        if (shoppingCart.length === 0) {
            e.preventDefault();
            alert('🛒 Tu carrito está vacío');
        }
    });
});