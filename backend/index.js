import express from 'express';
import db from "./config/database.js";
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import userrouter from './routes/userRoute.js';
import applicationsrouter from './routes/applicationsRoute.js';
import filesRouter from './routes/filesRoute.js';
import galleryRouter from './routes/galleryRoute.js';
import path from 'path';

dotenv.config();

const app = express();

// Настройка CORS
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware для парсинга данных
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Статические файлы
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/gallery', galleryRouter);

// Маршруты
app.use('/users', userrouter);
app.use('/application', applicationsrouter);
app.use('/files', filesRouter);

// Подключение к базе данных
try {
    await db.authenticate();
    console.log('База данных успешно подключена');
    
    // Синхронизация моделей с базой данных
    await db.sync();
    console.log('Модели успешно синхронизированы с базой данных');
} catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));