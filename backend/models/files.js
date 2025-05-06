import db from '../config/database.js'
import { DataTypes, Model } from 'sequelize'

class Files extends Model {}
Files.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        filename: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        originalname: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        mimetype: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        path: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
    },
    {
        sequelize: db,
        tableName: 'files',
        freezeTableName: true,
        modelName: 'Files',
        timestamps: true,
    },
);

// Синхронизация модели с базой данных
try {
    await Files.sync({ alter: true });
    console.log('Таблица files успешно синхронизирована');
} catch (error) {
    console.error('Ошибка при синхронизации таблицы files:', error);
}

export default Files; 