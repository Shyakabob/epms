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
  Stack,
} from '@mui/material';
import { Department } from '../../types';
import { getDepartments, deleteDepartment } from '../../services/api';
import DepartmentForm from './DepartmentForm';

const rwf = new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 });

const DepartmentList: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Department | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleDelete = async (code: string) => {
    try {
      await deleteDepartment(code);
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  const handleCloseForm = () => {
    setOpen(false);
    setSelected(null);
    fetchDepartments();
  };

  const openCreate = () => { setSelected(null); setOpen(true); };
  const openEdit = (dept: Department) => { setSelected(dept); setOpen(true); };

  return (
    <div>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Departments
        </Typography>
        <Button variant="contained" onClick={openCreate}>Add Department</Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Department Code</TableCell>
              <TableCell>Department Name</TableCell>
              <TableCell>Gross Salary</TableCell>
              <TableCell>Total Deduction</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map((department) => (
              <TableRow key={department.departmentCode}>
                <TableCell>{department.departmentCode}</TableCell>
                <TableCell>{department.departmentName}</TableCell>
                <TableCell>{rwf.format(department.grossSalary)}</TableCell>
                <TableCell>{rwf.format(department.totalDeduction)}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" onClick={() => openEdit(department)}>Edit</Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(department.departmentCode)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DepartmentForm open={open} onClose={handleCloseForm} initialValue={selected} />
    </div>
  );
};

export default DepartmentList; 