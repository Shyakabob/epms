import pool from '../config/database';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
    try {
        const username = 'admin';
        const password = 'admin123';
        const role = 'admin';

        // Delete existing admin user if exists
        await pool.query('DELETE FROM users WHERE username = ?', [username]);

        // Insert new admin user with hashed password
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role]
        );

        console.log('Admin user created successfully');
        console.log('Username:', username);
        console.log('Password:', password);
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser(); 