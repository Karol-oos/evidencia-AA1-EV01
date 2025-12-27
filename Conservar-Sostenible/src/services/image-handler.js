// src/services/image-handler.js
const fs = require('fs').promises;
const path = require('path');

class ImageHandler {
    constructor() {
        this.uploadDir = path.join(__dirname, '..', '..', 'public', 'img', 'uploads');
        this.initUploadDir();
    }

    async initUploadDir() {
        try {
            await fs.mkdir(this.uploadDir, { recursive: true });
        } catch (error) {
            console.error('Error creando directorio de uploads:', error);
        }
    }

    async uploadImage(file, customName = null) {
        try {
            const fileName = customName || `${Date.now()}-${file.name}`;
            const filePath = path.join(this.uploadDir, fileName);
            
            await fs.writeFile(filePath, file.data);
            
            return `/img/uploads/${fileName}`;
        } catch (error) {
            console.error('Error subiendo imagen:', error);
            throw new Error('No se pudo subir la imagen');
        }
    }

    async deleteImage(imagePath) {
        try {
            const fullPath = path.join(__dirname, '..', '..', 'public', imagePath);
            await fs.unlink(fullPath);
            return true;
        } catch (error) {
            console.error('Error eliminando imagen:', error);
            return false;
        }
    }

    async getImageInfo(imagePath) {
        try {
            const fullPath = path.join(__dirname, '..', '..', 'public', imagePath);
            const stats = await fs.stat(fullPath);
            
            return {
                path: imagePath,
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime
            };
        } catch (error) {
            return null;
        }
    }
}

module.exports = new ImageHandler();