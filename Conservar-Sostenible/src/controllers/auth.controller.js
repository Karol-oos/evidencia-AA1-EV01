const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ajusta la ruta según tu modelo

// Clave secreta para JWT (debería estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_por_defecto_cambiar_en_produccion';

const registerUser = async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;
    
    //  Verificar si el usuario ya existe
    const [rows] = await db.query('SELECT id FROM usuarios WHERE correo = ?', [correo]);
    if (rows.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }
    
    // Encriptar contraseña (similar a tu PHP)
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    
    // Insertar en la base de datos
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)',
      [nombre, correo, hashedPassword]
    );
    
    res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      userId: result.insertId 
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear nuevo usuario
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ 
            message: 'Usuario registrado exitosamente',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

// Función para login 
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //  Verificar si el correo existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
         //  Verificar si la contraseña coincide usando bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        //  Generar token JWT
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                name: user.name
            },
            JWT_SECRET,
            { expiresIn: '24h' } // El token expira en 24 horas
        );

        //  Responder con el token y datos del usuario
        res.status(200).json({
            message: 'Login exitoso',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Middleware para verificar token (opcional, útil para rutas protegidas)
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Formato: "Bearer token"
    
    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = {
    registerUser,
    loginUser,
    verifyToken
};
module.exports = { registerUser };