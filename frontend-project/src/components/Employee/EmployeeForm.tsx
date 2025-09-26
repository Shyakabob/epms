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
  Box,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name as string]: value }));
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
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <Box>
              <TextField
                name="employeeNumber"
                label="Employee Number"
                fullWidth
                required
                value={employee.employeeNumber}
                onChange={handleInputChange}
                disabled={!!initialData}
              />
            </Box>
            <Box>
              <FormControl fullWidth required>
                <InputLabel>Department</InputLabel>
                <Select
                  name="departmentCode"
                  value={employee.departmentCode}
                  onChange={handleSelectChange}
                  label="Department"
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.departmentCode} value={dept.departmentCode}>
                      {dept.departmentName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <TextField
                name="firstName"
                label="First Name"
                fullWidth
                required
                value={employee.firstName}
                onChange={handleInputChange}
              />
            </Box>
            <Box>
              <TextField
                name="lastName"
                label="Last Name"
                fullWidth
                required
                value={employee.lastName}
                onChange={handleInputChange}
              />
            </Box>
            <Box>
              <TextField
                name="position"
                label="Position"
                fullWidth
                required
                value={employee.position}
                onChange={handleInputChange}
              />
            </Box>
            <Box>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={employee.gender}
                  onChange={handleSelectChange}
                  label="Gender"
                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                name="address"
                label="Address"
                fullWidth
                required
                value={employee.address}
                onChange={handleInputChange}
              />
            </Box>
            <Box>
              <TextField
                name="telephone"
                label="Telephone"
                fullWidth
                required
                value={employee.telephone}
                onChange={handleInputChange}
              />
            </Box>
            <Box>
              <TextField
                name="hireDate"
                label="Hire Date"
                type="date"
                fullWidth
                required
                value={employee.hireDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </Box>
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