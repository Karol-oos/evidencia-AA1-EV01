// Simulación de API para desarrollo
const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

// Base de datos en memoria
const users = [];
const bookings = [];
const payments = [];

// Rutas de autenticación
app.post('/api/auth/register', (req, res) => {
    const user = { id: Date.now(), ...req.body };
    users.push(user);
    res.json({ success: true, user });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    
    if (user && user.password === password) {
        res.json({ success: true, user, token: 'mock-jwt-token' });
    } else {
        res.status(401).json({ error: 'Credenciales inválidas' });
    }
});

// Rutas de reservas
app.post('/api/bookings', (req, res) => {
    const booking = { id: 'RES-' + Date.now(), ...req.body };
    bookings.push(booking);
    res.json({ success: true, booking });
});

// Rutas de pagos
app.post('/api/payments', (req, res) => {
    const payment = { 
        id: 'TX-' + Date.now(), 
        status: 'completed',
        ...req.body 
    };
    payments.push(payment);
    res.json({ success: true, payment });
});

// Rutas de admin
app.get('/api/admin/stats', (req, res) => {
    res.json({
        users: users.length,
        bookings: bookings.length,
        revenue: bookings.reduce((sum, b) => sum + (b.total || 0), 0),
        activeBookings: bookings.filter(b => b.status === 'active').length
    });
});

app.listen(PORT, () => {
    console.log(`🚀 API mock en http://localhost:${PORT}`);
});