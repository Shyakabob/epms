import { RowDataPacket } from 'mysql2';

export interface Salary extends RowDataPacket {
    employeeNumber: string;
    grossSalary: number;
    totalDeduction: number;
    netSalary: number;
    month: string;
}

export interface SalaryInput {
    employeeNumber: string;
    grossSalary: number;
    totalDeduction: number;
    netSalary: number;
    month: string;
} 