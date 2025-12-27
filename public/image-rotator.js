// src/services/image-rotator.js
const fs = require('fs');
const path = require('path');

class ImageRotator {
    constructor() {
        // Imágenes del carrusel principal
        this.heroImages = [
            '/img/destino1.jpg',
            '/img/destino2.jpg',
            '/img/destino3.jpg',
            '/img/destino4.jpg',
            '/img/destino5.jpg',
            '/img/destino6.jpg'
        ];
        
        // Títulos y descripciones para cada imagen
        this.imageDetails = [
            { title: 'Montañas Verdes', desc: 'Naturaleza en su máximo esplendor' },
            { title: 'Playas Cristalinas', desc: 'Arena blanca y aguas turquesas' },
            { title: 'Selva Amazónica', desc: 'Biodiversidad única en el mundo' },
            { title: 'Desierto Mágico', desc: 'Paisajes áridos llenos de vida' },
            { title: 'Cascadas Escondidas', desc: 'Agua pura cayendo desde las alturas' },
            { title: 'Ciudades Ancestrales', desc: 'Cultura e historia viva' }
        ];
        
        this.currentIndex = 0;
        this.rotationInterval = null;
        this.rotationSpeed = 5000; // 5 segundos
        this.isRotating = false;
    }

    // Iniciar rotación automática
    startRotation() {
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
        }
        
        this.isRotating = true;
        this.rotationInterval = setInterval(() => {
            this.nextImage();
        }, this.rotationSpeed);
        
        console.log(`🔄 Rotación iniciada (${this.rotationSpeed}ms)`);
        return true;
    }

    // Detener rotación
    stopRotation() {
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
            this.rotationInterval = null;
            this.isRotating = false;
            console.log('⏸️ Rotación detenida');
            return true;
        }
        return false;
    }

    // Cambiar a siguiente imagen
    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.heroImages.length;
        this.emitChange();
        return this.getCurrentImageData();
    }

    // Cambiar a imagen anterior
    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.heroImages.length) % this.heroImages.length;
        this.emitChange();
        return this.getCurrentImageData();
    }

    // Ir a imagen específica
    goToImage(index) {
        if (index >= 0 && index < this.heroImages.length) {
            this.currentIndex = index;
            this.emitChange();
            return this.getCurrentImageData();
        }
        return null;
    }

    // Obtener datos de la imagen actual
    getCurrentImageData() {
        return {
            image: this.heroImages[this.currentIndex],
            index: this.currentIndex,
            title: this.imageDetails[this.currentIndex]?.title || 'Destino Turístico',
            description: this.imageDetails[this.currentIndex]?.desc || 'Explora la belleza natural',
            total: this.heroImages.length,
            isRotating: this.isRotating,
            speed: this.rotationSpeed
        };
    }

    // Obtener todas las imágenes
    getAllImages() {
        return this.heroImages.map((img, index) => ({
            image: img,
            index: index,
            title: this.imageDetails[index]?.title || `Destino ${index + 1}`,
            description: this.imageDetails[index]?.desc || 'Descripción no disponible',
            active: index === this.currentIndex
        }));
    }

    // Cambiar velocidad de rotación
    setRotationSpeed(speed) {
        if (speed >= 1000 && speed <= 30000) {
            this.rotationSpeed = speed;
            
            // Reiniciar rotación si estaba activa
            if (this.isRotating) {
                this.stopRotation();
                this.startRotation();
            }
            
            return true;
        }
        return false;
    }

    // Agregar nueva imagen al carrusel
    addImage(imagePath, title = 'Nuevo Destino', description = '') {
        this.heroImages.push(imagePath);
        this.imageDetails.push({ title, description });
        return this.heroImages.length - 1;
    }

    // Emitir evento de cambio (para WebSockets/Socket.io si se implementa)
    emitChange() {
        // Aquí podrías implementar WebSockets para notificar a los clientes
        // en tiempo real cuando la imagen cambia
        if (global.io) {
            global.io.emit('imageChanged', this.getCurrentImageData());
        }
    }

    // Verificar si archivo de imagen existe
    async imageExists(imagePath) {
        try {
            const fullPath = path.join(__dirname, '..', '..', 'public', imagePath);
            await fs.promises.access(fullPath);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Cargar imágenes desde carpeta
    async loadImagesFromFolder(folderPath) {
        try {
            const fullPath = path.join(__dirname, '..', '..', 'public', folderPath);
            const files = await fs.promises.readdir(fullPath);
            
            const imageFiles = files.filter(file => 
                /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
            );
            
            this.heroImages = imageFiles.map(file => `${folderPath}/${file}`);
            this.imageDetails = imageFiles.map(file => ({
                title: file.split('.')[0].replace(/-/g, ' '),
                description: `Imagen de ${file.split('.')[0]}`
            }));
            
            this.currentIndex = 0;
            console.log(`✅ Cargadas ${imageFiles.length} imágenes desde ${folderPath}`);
            return this.heroImages.length;
        } catch (error) {
            console.error('Error cargando imágenes:', error);
            return 0;
        }
    }

    // Estado del rotador
    getStatus() {
        return {
            isRotating: this.isRotating,
            currentIndex: this.currentIndex,
            rotationSpeed: this.rotationSpeed,
            totalImages: this.heroImages.length,
            images: this.heroImages
        };
    }
}

module.exports = new ImageRotator();