import { Sequelize } from 'sequelize';
import db from '../config/database.js';

async function renameAvatarUrlColumn() {
    try {
        await db.query(`
            ALTER TABLE users 
            CHANGE COLUMN avatarUrl avatar VARCHAR(255);
        `);
        console.log('Column "avatarUrl" renamed to "avatar" successfully');
    } catch (error) {
        console.error('Error renaming column:', error);
    }
}

renameAvatarUrlColumn(); 