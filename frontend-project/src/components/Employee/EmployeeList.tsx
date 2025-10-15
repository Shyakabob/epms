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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { Employee, Department } from '../../types';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, getDepartments } from '../../services/api';
import EmployeeForm from './EmployeeForm';

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [openForm, setOpenForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>();
  const [alert, setAlert] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedDepartment) {
      const filtered = employees.filter(emp => emp.departmentCode === selectedDepartment);
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [employees, selectedDepartment]);

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      showAlert('Error fetching employees', 'error');
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      showAlert('Error fetching departments', 'error');
    }
  };

  const handleDepartmentFilter = (departmentCode: string) => {
    setSelectedDepartment(departmentCode);
  };

  const clearFilter = () => {
    setSelectedDepartment('');
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

      {/* Department Filter Section */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
          <FilterListIcon color="primary" />
          <Typography variant="h6" color="primary">
            Filter by Department:
          </Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Department</InputLabel>
            <Select
              value={selectedDepartment}
              label="Select Department"
              onChange={(e) => handleDepartmentFilter(e.target.value)}
            >
              <MenuItem value="">
                <em>All Departments</em>
              </MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.departmentCode} value={dept.departmentCode}>
                  {dept.departmentName} ({dept.departmentCode})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedDepartment && (
            <>
              <Chip
                label={`${departments.find(d => d.departmentCode === selectedDepartment)?.departmentName || selectedDepartment} (${filteredEmployees.length} employees)`}
                color="primary"
                variant="outlined"
              />
              <Button
                startIcon={<ClearIcon />}
                onClick={clearFilter}
                variant="outlined"
                size="small"
              >
                Clear Filter
              </Button>
            </>
          )}
        </Stack>
      </Box>

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
            {filteredEmployees.map((employee) => (
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
        <Alert onClose={handleCloseAlert} severity={alert?.severity ?? 'success'}>
          {alert?.message ?? ''}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EmployeeList; 