import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  IconButton,
  Stack,
  Alert,
  Snackbar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Employee } from '../../types';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../../services/api';
import EmployeeForm from './EmployeeForm';

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>();
  const [alert, setAlert] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      showAlert('Error fetching employees', 'error');
    }
  };

  const handleCreate = async (employee: Employee) => {
    try {
      await createEmployee(employee);
      fetchEmployees();
      setOpenForm(false);
      showAlert('Employee created successfully', 'success');
    } catch (error) {
      console.error('Error creating employee:', error);
      showAlert('Error creating employee', 'error');
    }
  };

  const handleUpdate = async (employee: Employee) => {
    try {
      await updateEmployee(employee.employeeNumber, employee);
      fetchEmployees();
      setOpenForm(false);
      setSelectedEmployee(undefined);
      showAlert('Employee updated successfully', 'success');
    } catch (error) {
      console.error('Error updating employee:', error);
      showAlert('Error updating employee', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id);
        fetchEmployees();
        showAlert('Employee deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting employee:', error);
        showAlert('Error deleting employee', 'error');
      }
    }
  };

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlert({ message, severity });
  };

  const handleCloseAlert = () => {
    setAlert(null);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedEmployee(undefined);
  };

  return (
    <div>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          Employees
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenForm(true)}
        >
          Add Employee
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Telephone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.employeeNumber}>
                <TableCell>{employee.employeeNumber}</TableCell>
                <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.departmentCode}</TableCell>
                <TableCell>{employee.gender}</TableCell>
                <TableCell>{employee.telephone}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(employee)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(employee.employeeNumber)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EmployeeForm
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={selectedEmployee ? handleUpdate : handleCreate}
        initialData={selectedEmployee}
        title={selectedEmployee ? 'Edit Employee' : 'Add Employee'}
      />

      <Snackbar
        open={!!alert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {alert && (
          <Alert onClose={handleCloseAlert} severity={alert.severity}>
            {alert.message}
          </Alert>
        )}
      </Snackbar>
    </div>
  );
};

export default EmployeeList; 