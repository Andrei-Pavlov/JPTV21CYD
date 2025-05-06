import { DataTypes } from 'sequelize';
import db from '../config/database.js';
import User from './user.js';

const LoginHistory = db.define('LoginHistory', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    device: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Успешно', 'Подозрительно', 'Неудачно'),
        defaultValue: 'Успешно'
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

// Создаем связь с моделью User
LoginHistory.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(LoginHistory, { foreignKey: 'userId' });

// Синхронизация модели с базой данных
try {
    await LoginHistory.sync({ alter: true });
    console.log('Таблица login_histories успешно синхронизирована');
} catch (error) {
    console.error('Ошибка при синхронизации таблицы login_histories:', error);
}

export default LoginHistory; 