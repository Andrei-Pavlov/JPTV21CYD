-- Устанавливаем кодировку для базы данных
ALTER DATABASE ITsuustem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Конвертируем таблицу
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Изменяем тип и кодировку для поля about
ALTER TABLE users MODIFY COLUMN about TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; 