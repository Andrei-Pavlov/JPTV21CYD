import { Sequelize } from 'sequelize';
import db from '../config/database.js';

async function addAboutColumn() {
    try {
        await db.query(`
            ALTER TABLE users 
            ADD COLUMN about TEXT NULL 
            AFTER role;
        `);
        console.log('Column "about" added successfully');
    } catch (error) {
        if (error.original && error.original.code === 'ER_DUP_FIELDNAME') {
            console.log('Column "about" already exists');
        } else {
            console.error('Error adding column:', error);
        }
    }
}

addAboutColumn()
    .then(() => {
        console.log('Migration completed');
        process.exit(0);
    })
    .catch(error => {
        console.error('Migration failed:', error);
        process.exit(1);
    }); 