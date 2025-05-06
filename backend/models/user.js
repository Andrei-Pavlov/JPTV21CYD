import db from '../config/database.js'
import { DataTypes, Model } from 'sequelize'

class User extends Model {}
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'user'
        },
        about: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        lastPasswordChange: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize: db,
        tableName: 'users',
        freezeTableName: true,
        modelName: 'User',
        timestamps: true,
    },
);

// Синхронизация модели с базой данных
try {
    await User.sync({ alter: true });
    console.log('Таблица users успешно синхронизирована');
} catch (error) {
    console.error('Ошибка при синхронизации таблицы users:', error);
}

export default User;