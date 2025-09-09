import { RowDataPacket } from 'mysql2';

export interface Department extends RowDataPacket {
    departmentCode: string;
    departmentName: string;
    grossSalary: number;
    totalDeduction: number;
}

export interface DepartmentInput {
    departmentCode: string;
    departmentName: string;
    grossSalary: number;
    totalDeduction: number;
} 