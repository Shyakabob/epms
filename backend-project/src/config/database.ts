import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const useSsl = process.env.DB_SSL === 'true';

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'epms_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined
});

export default pool; 