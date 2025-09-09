import axios from 'axios';
import { Employee, Department, Salary } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error);
        return Promise.reject(error);
    }
);

// Auth endpoints
export const login = (username: string, password: string) =>
    api.post('/auth/login', { username, password });

export const getCurrentUser = () => api.get('/auth/me');

// Employee endpoints
export const getEmployees = () => api.get<Employee[]>('/employees');
export const createEmployee = (employee: Employee) => api.post('/employees', employee);
export const updateEmployee = (id: string, employee: Employee) => api.put(`/employees/${id}`, employee);
export const deleteEmployee = (id: string) => api.delete(`/employees/${id}`);

// Department endpoints
export const getDepartments = () => api.get<Department[]>('/departments');
export const createDepartment = (department: Department) => api.post('/departments', department);
export const updateDepartment = (code: string, department: Department) => api.put(`/departments/${code}`, department);
export const deleteDepartment = (code: string) => api.delete(`/departments/${code}`);

// Salary endpoints
export const getSalaries = () => api.get<Salary[]>('/salaries');
export const createSalary = (salary: Salary) => api.post('/salaries', salary);
export const updateSalary = (id: string, salary: Salary) => api.put(`/salaries/${id}`, salary);
export const deleteSalary = (id: string, month: string) => api.delete(`/salaries/${id}/${month}`);

// Reports endpoints
export interface ReportSummaryRow { departmentCode: string; grossTotal: number; deductionTotal: number; netTotal: number }
export interface ReportSummary { month: string; perDepartment: ReportSummaryRow[]; totals: { grossTotal: number; deductionTotal: number; netTotal: number } }
export const getReportSummary = (month: string) => api.get<ReportSummary>(`/reports/summary`, { params: { month } });
export const downloadReportCsv = (month: string) => api.get(`/reports/summary.csv`, { params: { month }, responseType: 'blob' }); 