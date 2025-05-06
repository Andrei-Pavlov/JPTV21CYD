import db from '../config/database.js'
import { DataTypes, Model } from 'sequelize'

class Applications extends Model {}
Applications.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        letter: {
            type: DataTypes.STRING,
        },
        photo: {
            type: DataTypes.STRING,
        },
        isAccepted: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        sequelize: db,
        tableName: 'applications',
        freezeTableName: true,
        modelName: 'Applications',
        timestamps: false,
    },
);

export default Applications;