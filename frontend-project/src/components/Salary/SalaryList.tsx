import React, { useEffect, useMemo, useState } from 'react';
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
import { Salary } from '../../types';
import { getSalaries, deleteSalary } from '../../services/api';
import SalaryForm from './SalaryForm';

const rwfFormatter = new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 });

const SalaryList: React.FC = () => {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Salary | null>(null);

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      const response = await getSalaries();
      setSalaries(response.data);
    } catch (error) {
      console.error('Error fetching salaries:', error);
    }
  };

  const handleDelete = async (employeeNumber: string, month: string) => {
    try {
      await deleteSalary(employeeNumber, month);
      fetchSalaries();
    } catch (error) {
      console.error('Error deleting salary:', error);
    }
  };

  const handleCloseForm = () => {
    setOpen(false);
    setSelected(null);
    fetchSalaries();
  };

  const openCreate = () => {
    setSelected(null);
    setOpen(true);
  };

  const openEdit = (salary: Salary) => {
    setSelected(salary);
    setOpen(true);
  };

  return (
    <div>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Salaries
        </Typography>
        <Button variant="contained" onClick={openCreate}>Add Salary</Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee Number</TableCell>
              <TableCell>Month</TableCell>
              <TableCell>Gross Salary</TableCell>
              <TableCell>Total Deduction</TableCell>
              <TableCell>Net Salary</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salaries.map((salary) => (
              <TableRow key={`${salary.employeeNumber}-${salary.month}`}>
                <TableCell>{salary.employeeNumber}</TableCell>
                <TableCell>{salary.month}</TableCell>
                <TableCell>{rwfFormatter.format(salary.grossSalary)}</TableCell>
                <TableCell>{rwfFormatter.format(salary.totalDeduction)}</TableCell>
                <TableCell>{rwfFormatter.format(salary.netSalary)}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" onClick={() => openEdit(salary)}>Edit</Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(salary.employeeNumber, salary.month)}
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
      <SalaryForm open={open} onClose={handleCloseForm} initialValue={selected} />
    </div>
  );
};

export default SalaryList; 