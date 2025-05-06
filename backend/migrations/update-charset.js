import db from '../config/database.js';

async function updateCharset() {
    try {
        // Изменяем кодировку базы данных
        await db.query(`ALTER DATABASE ITsuustem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        
        // Изменяем кодировку таблицы users
        await db.query(`ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        
        // Специально для поля about
        await db.query(`ALTER TABLE users MODIFY about TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        
        console.log('Database charset updated successfully');
    } catch (error) {
        console.error('Error updating charset:', error);
    }
}

updateCharset(); 