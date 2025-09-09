import express from 'express';
import { Request, Response } from 'express';
import pool from '../config/database';
import { Salary, SalaryInput } from '../models/Salary';

const router = express.Router();

// Get all salaries
router.get('/', async (req: Request, res: Response) => {
    try {
        const [salaries] = await pool.query<Salary[]>('SELECT * FROM salaries');
        res.json(salaries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching salaries' });
    }
});

// Create salary record
router.post('/', async (req: Request, res: Response) => {
    try {
        const salary: SalaryInput = req.body;
        await pool.query(
            'INSERT INTO salaries SET ?',
            [salary]
        );
        res.status(201).json({ message: 'Salary record created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating salary record' });
    }
});

// Update salary record
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const salary: SalaryInput = req.body;
        await pool.query(
            'UPDATE salaries SET ? WHERE employeeNumber = ? AND month = ?',
            [salary, id, salary.month]
        );
        res.json({ message: 'Salary record updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating salary record' });
    }
});

// Delete salary record
router.delete('/:id/:month', async (req: Request, res: Response) => {
    try {
        const { id, month } = req.params;
        await pool.query(
            'DELETE FROM salaries WHERE employeeNumber = ? AND month = ?',
            [id, month]
        );
        res.json({ message: 'Salary record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting salary record' });
    }
});

export default router; 