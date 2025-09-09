import express from 'express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { User } from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Login route
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Get user from database
        const [users] = await pool.query<User[]>(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Check password (direct comparison)
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error during login' });
    }
});

// Get current user
router.get('/me', authenticateToken, (req: AuthRequest, res: Response) => {
    res.json(req.user);
});

// Register new user (admin only)
router.post('/register', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const { username, password, role } = req.body;

        // Insert new user with plain password
        await pool.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, password, role]
        );

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

export default router; 