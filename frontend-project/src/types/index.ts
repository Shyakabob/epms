export interface Employee {
    employeeNumber: string;
    firstName: string;
    lastName: string;
    position: string;
    address: string;
    telephone: string;
    gender: 'M' | 'F';
    hireDate: string;
    departmentCode: string;
}

export interface Department {
    departmentCode: string;
    departmentName: string;
    grossSalary: number;
    totalDeduction: number;
}

export interface Salary {
    employeeNumber: string;
    grossSalary: number;
    totalDeduction: number;
    netSalary: number;
    month: string;
} 