import { Sequelize } from "sequelize";

const db = new Sequelize('ITsuustem', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    },
    dialectOptions: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        options: {
            requestTimeout: 30000
        },
        connectTimeout: 30000,
        multipleStatements: true,
        flags: [
            'MYSQL_ATTR_INIT_COMMAND=SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci'
        ]
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Проверяем и устанавливаем кодировку при подключении
db.afterConnect(async (connection) => {
    try {
        await connection.query('SET NAMES utf8mb4');
        await connection.query('SET CHARACTER SET utf8mb4');
        await connection.query('SET CHARACTER_SET_CONNECTION=utf8mb4');
        console.log('Connection charset set successfully');
    } catch (error) {
        console.error('Error setting connection charset:', error);
    }
});

export default db;