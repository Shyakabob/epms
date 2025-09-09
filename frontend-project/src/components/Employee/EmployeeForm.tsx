import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { Employee } from '../../types';
import { getDepartments } from '../../services/api';
import { Department } from '../../types';

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (employee: Employee) => void;
  initialData?: Employee;
  title: string;
}

const defaultEmployee: Employee = {
  employeeNumber: '',
  firstName: '',
  lastName: '',
  position: '',
  address: '',
  telephone: '',
  gender: 'M',
  hireDate: new Date().toISOString().split('T')[0],
  departmentCode: '',
};

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  title,
}) => {
  const [employee, setEmployee] = useState<Employee>(defaultEmployee);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    if (initialData) {
      setEmployee(initialData);
    } else {
      setEmployee(defaultEmployee);
    }
    fetchDepartments();
  }, [initialData, open]);

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(employee);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                name="employeeNumber"
                label="Employee Number"
                fullWidth
                required
                value={employee.employeeNumber}
                onChange={handleChange}
                disabled={!!initialData}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Department</InputLabel>
                <Select
                  name="departmentCode"
                  value={employee.departmentCode}
                  onChange={handleChange}
                  label="Department"
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.departmentCode} value={dept.departmentCode}>
                      {dept.departmentName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="firstName"
                label="First Name"
                fullWidth
                required
                value={employee.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="lastName"
                label="Last Name"
                fullWidth
                required
                value={employee.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="position"
                label="Position"
                fullWidth
                required
                value={employee.position}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={employee.gender}
                  onChange={handleChange}
                  label="Gender"
                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                fullWidth
                required
                value={employee.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="telephone"
                label="Telephone"
                fullWidth
                required
                value={employee.telephone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="hireDate"
                label="Hire Date"
                type="date"
                fullWidth
                required
                value={employee.hireDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EmployeeForm; 