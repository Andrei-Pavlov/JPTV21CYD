import Files from '../models/files.js';
import fs from 'fs';
import path from 'path';

export const uploadFile = async (req, res) => {
    try {
        console.log('Начало обработки загрузки файла');
        
        if (!req.file) {
            console.error('Файл отсутствует в запросе');
            return res.status(400).json({ message: 'Файл не был загружен' });
        }

        // Проверка размера файла (250MB = 250 * 1024 * 1024 bytes)
        const maxSize = 250 * 1024 * 1024;
        if (req.file.size > maxSize) {
            // Удаляем файл если он слишком большой
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Файл слишком большой. Максимальный размер 250MB' });
        }

        console.log('Информация о файле:', {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            description: req.body.description
        });

        try {
            const file = await Files.create({
                filename: req.file.filename,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                path: req.file.path,
                description: req.body.description || null
            });

            console.log('Файл успешно сохранен в базе данных, ID:', file.id);

            res.status(201).json({
                message: 'Файл успешно загружен',
                file: {
                    id: file.id,
                    filename: file.filename,
                    originalname: file.originalname,
                    size: file.size,
                    description: file.description
                }
            });
        } catch (dbError) {
            // Если произошла ошибка при сохранении в БД, удаляем загруженный файл
            fs.unlinkSync(req.file.path);
            console.error('Ошибка при сохранении в базу данных:', dbError);
            return res.status(500).json({ 
                message: 'Ошибка при сохранении файла в базу данных',
                error: dbError.message 
            });
        }
    } catch (error) {
        console.error('Общая ошибка при загрузке файла:', error);
        console.error('Стек ошибки:', error.stack);
        
        // Если файл был загружен, но произошла ошибка, удаляем его
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                message: 'Ошибка валидации данных',
                details: error.errors.map(err => err.message)
            });
        }
        
        if (error.name === 'SequelizeDatabaseError') {
            return res.status(500).json({ 
                message: 'Ошибка базы данных',
                error: error.message 
            });
        }

        res.status(500).json({ 
            message: 'Ошибка при загрузке файла',
            error: error.message 
        });
    }
};

export const downloadFile = async (req, res) => {
    try {
        const file = await Files.findByPk(req.params.id);
        
        if (!file) {
            return res.status(404).json({ message: 'Файл не найден' });
        }

        // Проверяем существование файла на диске
        if (!fs.existsSync(file.path)) {
            return res.status(404).json({ message: 'Файл не найден на диске' });
        }

        // Отправляем файл
        res.setHeader('Content-Type', file.mimetype);
        res.setHeader('Content-Disposition', `attachment; filename="${file.originalname}"`);
        
        // Создаем поток для чтения файла и отправки его клиенту
        const fileStream = fs.createReadStream(file.path);
        fileStream.pipe(res);

        // Обработка ошибок потока
        fileStream.on('error', (error) => {
            console.error('Ошибка при чтении файла:', error);
            if (!res.headersSent) {
                res.status(500).json({ 
                    message: 'Ошибка при чтении файла',
                    error: error.message 
                });
            }
        });
    } catch (error) {
        console.error('Ошибка при скачивании файла:', error);
        if (!res.headersSent) {
            res.status(500).json({ 
                message: 'Ошибка при скачивании файла',
                error: error.message 
            });
        }
    }
};

export const getFiles = async (req, res) => {
    try {
        const files = await Files.findAll({
            attributes: ['id', 'filename', 'originalname', 'size', 'createdAt', 'description']
        });
        res.json(files);
    } catch (error) {
        console.error('Ошибка при получении списка файлов:', error);
        res.status(500).json({ 
            message: 'Ошибка при получении списка файлов',
            error: error.message 
        });
    }
}; 