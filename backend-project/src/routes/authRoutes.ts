import express from 'express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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

        // Check password using bcrypt hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
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
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role]
        );

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Verify current password
router.post('/verify-password', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const { currentPassword } = req.body as { currentPassword: string };
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const [users] = await pool.query<User[]>(
            'SELECT * FROM users WHERE id = ?',
            [req.user.id]
        );

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        return res.json({ valid: true });
    } catch (error) {
        console.error('Verify password error:', error);
        res.status(500).json({ message: 'Error verifying password' });
    }
});

// Change password
router.post('/change-password', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const [users] = await pool.query<User[]>(
            'SELECT * FROM users WHERE id = ?',
            [req.user.id]
        );

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Error changing password' });
    }
});

export default router; 