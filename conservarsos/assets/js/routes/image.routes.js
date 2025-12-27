// src/routes/image.routes.js
const express = require('express');
const router = express.Router();
const ImageRotator = require('../services/image-rotator');
const ImageHandler = require('../services/image-handler');

// Obtener imagen actual
router.get('/current', (req, res) => {
    try {
        const imageData = ImageRotator.getCurrentImageData();
        res.json({
            success: true,
            ...imageData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener imagen actual',
            error: error.message
        });
    }
});

// Obtener todas las imágenes
router.get('/all', (req, res) => {
    try {
        const images = ImageRotator.getAllImages();
        res.json({
            success: true,
            images: images,
            count: images.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener imágenes',
            error: error.message
        });
    }
});

// Siguiente imagen
router.post('/next', (req, res) => {
    try {
        const imageData = ImageRotator.nextImage();
        res.json({
            success: true,
            message: 'Imagen cambiada a la siguiente',
            ...imageData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al cambiar imagen',
            error: error.message
        });
    }
});

// Imagen anterior
router.post('/prev', (req, res) => {
    try {
        const imageData = ImageRotator.prevImage();
        res.json({
            success: true,
            message: 'Imagen cambiada a la anterior',
            ...imageData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al cambiar imagen',
            error: error.message
        });
    }
});

// Ir a imagen específica
router.post('/goto/:index', (req, res) => {
    try {
        const index = parseInt(req.params.index);
        const imageData = ImageRotator.goToImage(index);
        
        if (imageData) {
            res.json({
                success: true,
                message: `Imagen cambiada a la posición ${index}`,
                ...imageData
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Índice de imagen no válido'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al cambiar imagen',
            error: error.message
        });
    }
});

// Controlar rotación
router.post('/rotation/start', (req, res) => {
    try {
        const started = ImageRotator.startRotation();
        if (started) {
            res.json({
                success: true,
                message: 'Rotación iniciada',
                ...ImageRotator.getCurrentImageData()
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'No se pudo iniciar la rotación'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al iniciar rotación',
            error: error.message
        });
    }
});

router.post('/rotation/stop', (req, res) => {
    try {
        const stopped = ImageRotator.stopRotation();
        if (stopped) {
            res.json({
                success: true,
                message: 'Rotación detenida',
                ...ImageRotator.getCurrentImageData()
            });
        } else {
            res.json({
                success: true,
                message: 'La rotación ya estaba detenida'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al detener rotación',
            error: error.message
        });
    }
});

router.post('/rotation/toggle', (req, res) => {
    try {
        const status = ImageRotator.getStatus();
        if (status.isRotating) {
            ImageRotator.stopRotation();
            res.json({
                success: true,
                message: 'Rotación detenida',
                isRotating: false
            });
        } else {
            ImageRotator.startRotation();
            res.json({
                success: true,
                message: 'Rotación iniciada',
                isRotating: true
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al alternar rotación',
            error: error.message
        });
    }
});

// Cambiar velocidad de rotación
router.post('/rotation/speed', (req, res) => {
    try {
        const { speed } = req.body;
        
        if (!speed || isNaN(speed) || speed < 1000 || speed > 30000) {
            return res.status(400).json({
                success: false,
                message: 'Velocidad no válida (debe ser entre 1000 y 30000 ms)'
            });
        }
        
        const changed = ImageRotator.setRotationSpeed(parseInt(speed));
        
        if (changed) {
            res.json({
                success: true,
                message: `Velocidad de rotación cambiada a ${speed}ms`,
                speed: speed,
                isRotating: ImageRotator.getStatus().isRotating
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'No se pudo cambiar la velocidad'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al cambiar velocidad',
            error: error.message
        });
    }
});

// Subir nueva imagen
router.post('/upload', async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({
                success: false,
                message: 'No se ha subido ninguna imagen'
            });
        }
        
        const image = req.files.image;
        const { title, description } = req.body;
        
        // Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(image.mimetype)) {
            return res.status(400).json({
                success: false,
                message: 'Tipo de archivo no permitido. Solo JPG, PNG, GIF o WebP'
            });
        }
        
        // Validar tamaño (máximo 10MB)
        if (image.size > 10 * 1024 * 1024) {
            return res.status(400).json({
                success: false,
                message: 'La imagen es demasiado grande (máximo 10MB)'
            });
        }
        
        // Guardar imagen
        const uploadPath = path.join(__dirname, '..', '..', 'public', 'img', 'uploads', image.name);
        await image.mv(uploadPath);
        
        const imageUrl = `/img/uploads/${image.name}`;
        
        // Agregar al carrusel si se solicita
        if (req.body.addToCarousel === 'true') {
            const index = ImageRotator.addImage(imageUrl, title, description);
            
            res.json({
                success: true,
                message: 'Imagen subida y agregada al carrusel',
                imageUrl: imageUrl,
                index: index,
                carouselSize: ImageRotator.getAllImages().length
            });
        } else {
            res.json({
                success: true,
                message: 'Imagen subida exitosamente',
                imageUrl: imageUrl
            });
        }
    } catch (error) {
        console.error('Error al subir imagen:', error);
        res.status(500).json({
            success: false,
            message: 'Error al subir imagen',
            error: error.message
        });
    }
});

// Obtener estado del rotador
router.get('/status', (req, res) => {
    try {
        const status = ImageRotator.getStatus();
        res.json({
            success: true,
            ...status
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener estado',
            error: error.message
        });
    }
});

// Cargar imágenes desde carpeta
router.post('/load-folder', async (req, res) => {
    try {
        const { folderPath } = req.body;
        
        if (!folderPath) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere la ruta de la carpeta'
            });
        }
        
        const count = await ImageRotator.loadImagesFromFolder(folderPath);
        
        res.json({
            success: true,
            message: `Cargadas ${count} imágenes desde ${folderPath}`,
            count: count,
            images: ImageRotator.getAllImages()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al cargar imágenes desde carpeta',
            error: error.message
        });
    }
});

module.exports = router;