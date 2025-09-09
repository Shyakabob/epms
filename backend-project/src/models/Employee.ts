import { RowDataPacket } from 'mysql2';

export interface Employee extends RowDataPacket {
    employeeNumber: string;
    firstName: string;
    lastName: string;
    position: string;
    address: string;
    telephone: string;
    gender: string;
    hireDate: Date;
    departmentCode: string;
}

export interface EmployeeInput {
    employeeNumber: string;
    firstName: string;
    lastName: string;
    position: string;
    address: string;
    telephone: string;
    gender: string;
    hireDate: Date;
    departmentCode: string;
} 