import express from 'express';
import { Request, Response } from 'express';
import pool from '../config/database';
import { Employee, EmployeeInput } from '../models/Employee';

const router = express.Router();

// Get all employees
router.get('/', async (req: Request, res: Response) => {
    try {
        const [employees] = await pool.query<Employee[]>('SELECT * FROM employees');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees' });
    }
});

// Create employee
router.post('/', async (req: Request, res: Response) => {
    try {
        const employee: EmployeeInput = req.body;
        const [result] = await pool.query(
            'INSERT INTO employees SET ?',
            [employee]
        );
        res.status(201).json({ message: 'Employee created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating employee' });
    }
});

// Update employee
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const employee: EmployeeInput = req.body;
        await pool.query(
            'UPDATE employees SET ? WHERE employeeNumber = ?',
            [employee, id]
        );
        res.json({ message: 'Employee updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee' });
    }
});

// Delete employee
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM employees WHERE employeeNumber = ?', [id]);
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee' });
    }
});

export default router; 