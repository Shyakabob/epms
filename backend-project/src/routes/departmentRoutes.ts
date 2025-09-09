import express from 'express';
import { Request, Response } from 'express';
import pool from '../config/database';
import { Department, DepartmentInput } from '../models/Department';

const router = express.Router();

// Get all departments
router.get('/', async (req: Request, res: Response) => {
    try {
        const [departments] = await pool.query<Department[]>('SELECT * FROM departments');
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching departments' });
    }
});

// Create department
router.post('/', async (req: Request, res: Response) => {
    try {
        const department: DepartmentInput = req.body;
        await pool.query(
            'INSERT INTO departments SET ?',
            [department]
        );
        res.status(201).json({ message: 'Department created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating department' });
    }
});

// Update department
router.put('/:code', async (req: Request, res: Response) => {
    try {
        const { code } = req.params;
        const department: DepartmentInput = req.body;
        await pool.query(
            'UPDATE departments SET ? WHERE departmentCode = ?',
            [department, code]
        );
        res.json({ message: 'Department updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating department' });
    }
});

// Delete department
router.delete('/:code', async (req: Request, res: Response) => {
    try {
        const { code } = req.params;
        await pool.query('DELETE FROM departments WHERE departmentCode = ?', [code]);
        res.json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting department' });
    }
});

export default router; 