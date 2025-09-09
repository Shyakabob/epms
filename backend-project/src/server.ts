import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticateToken } from './middleware/auth';
import authRoutes from './routes/authRoutes';
import employeeRoutes from './routes/employeeRoutes';
import departmentRoutes from './routes/departmentRoutes';
import salaryRoutes from './routes/salaryRoutes';
import reportRoutes from './routes/reportRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/employees', authenticateToken, employeeRoutes);
app.use('/api/departments', authenticateToken, departmentRoutes);
app.use('/api/salaries', authenticateToken, salaryRoutes);
app.use('/api/reports', authenticateToken, reportRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 