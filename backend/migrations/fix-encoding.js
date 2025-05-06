import db from '../config/database.js';

async function fixEncoding() {
    try {
        // Устанавливаем правильную кодировку соединения
        await db.query('SET NAMES utf8mb4');
        await db.query('SET CHARACTER SET utf8mb4');
        
        // Обновляем кодировку базы данных
        await db.query('ALTER DATABASE ITsuustem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
        
        // Обновляем кодировку таблицы
        await db.query('ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
        
        // Обновляем кодировку конкретного поля
        await db.query('ALTER TABLE users MODIFY COLUMN about TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
        
        // Пересоздаем индексы (если есть)
        await db.query('ALTER TABLE users DROP INDEX IF EXISTS about_index');
        await db.query('ALTER TABLE users ADD FULLTEXT INDEX about_index (about)');
        
        console.log('Encoding fixed successfully');
    } catch (error) {
        console.error('Error fixing encoding:', error);
    } finally {
        await db.close();
    }
}

fixEncoding(); 