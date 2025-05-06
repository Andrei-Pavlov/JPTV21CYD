import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadFile, downloadFile, getFiles } from '../controllers/filesController.js';
import { checkAuth } from '../validation/checkAuth.js';
import fs from 'fs';

const router = express.Router();

// Список разрешенных типов файлов
const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/json',
    'application/xml',
    'text/xml',
    'application/zip',
    'application/x-zip-compressed',
    'application/x-compressed',
    'application/octet-stream',
    'application/x-rar-compressed'
];

// Список разрешенных расширений файлов
const allowedExtensions = [
    '.pdf', '.doc', '.docx', 
    '.xls', '.xlsx', 
    '.ppt', '.pptx',
    '.txt', '.json', '.xml',
    '.zip', '.rar'
];

// Настройка multer для обработки файлов
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(process.cwd(), 'uploads');
        // Создаем директорию, если она не существует
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Генерируем уникальное имя файла
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 250 * 1024 * 1024 // Ограничение размера файла до 250MB
    },
    fileFilter: (req, file, cb) => {
        console.log('Загружаемый файл:', {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size
        });

        // Проверка MIME-типа
        if (!allowedMimeTypes.includes(file.mimetype)) {
            console.log('Отклонено: недопустимый MIME-тип:', file.mimetype);
            return cb(new Error(`Недопустимый тип файла (${file.mimetype}). Разрешены только документы, архивы и текстовые файлы.`), false);
        }

        // Проверка расширения
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            console.log('Отклонено: недопустимое расширение:', ext);
            return cb(new Error('Недопустимое расширение файла. Разрешены только: ' + allowedExtensions.join(', ')), false);
        }

        console.log('Файл прошел проверку');
        cb(null, true);
    }
}).single('file');

// Middleware для обработки ошибок multer
const handleMulterError = (err, req, res, next) => {
    console.log('Multer error:', err);
    console.log('File info:', req.file);
    
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'Файл слишком большой. Максимальный размер 250MB' });
        }
        return res.status(400).json({ message: `Ошибка при загрузке файла: ${err.message}` });
    }
    if (err) {
        return res.status(400).json({ 
            message: err.message,
            details: {
                mimetype: req.file?.mimetype,
                originalname: req.file?.originalname
            }
        });
    }
    next();
};

// Middleware для загрузки файла с обработкой ошибок
const uploadMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            console.error('Ошибка при загрузке:', err);
            return handleMulterError(err, req, res, next);
        }
        if (!req.file) {
            console.error('Файл не был получен');
            return res.status(400).json({ message: 'Файл не был загружен' });
        }
        console.log('Файл успешно загружен:', req.file.originalname);
        next();
    });
};

// Маршруты для работы с файлами
router.post('/upload', checkAuth, uploadMiddleware, uploadFile);
router.get('/download/:id', checkAuth, downloadFile);
router.get('/list', checkAuth, getFiles);

export default router; 