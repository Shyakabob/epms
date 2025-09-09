import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Employee, Salary } from '../../types';
import { getEmployees, createSalary, updateSalary } from '../../services/api';

interface SalaryFormProps {
	open: boolean;
	onClose: () => void;
	initialValue?: Salary | null;
}

const rwfFormatter = new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 });

const SalaryForm: React.FC<SalaryFormProps> = ({ open, onClose, initialValue }) => {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [form, setForm] = useState<Salary>({
		employeeNumber: '',
		grossSalary: 0,
		totalDeduction: 0,
		netSalary: 0,
		month: ''
	});
	const isEdit = useMemo(() => Boolean(initialValue), [initialValue]);

	useEffect(() => {
		(async () => {
			try {
				const res = await getEmployees();
				setEmployees(res.data);
			} catch (e) {}
		})();
	}, []);

	useEffect(() => {
		if (initialValue) {
			setForm(initialValue);
		} else {
			setForm({ employeeNumber: '', grossSalary: 0, totalDeduction: 0, netSalary: 0, month: '' });
		}
	}, [initialValue, open]);

	useEffect(() => {
		const net = Number(form.grossSalary) - Number(form.totalDeduction);
		setForm((prev) => ({ ...prev, netSalary: net < 0 ? 0 : net }));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form.grossSalary, form.totalDeduction]);

	const handleChange = (field: keyof Salary) => (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = field === 'grossSalary' || field === 'totalDeduction' || field === 'netSalary' ? Number(e.target.value) : e.target.value;
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async () => {
		try {
			if (isEdit) {
				await updateSalary(form.employeeNumber, form);
			} else {
				await createSalary(form);
			}
			onClose();
		} catch (e) {}
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>{isEdit ? 'Edit Salary' : 'Add Salary'}</DialogTitle>
			<DialogContent>
				<Grid container spacing={2} sx={{ mt: 0.5 }}>
					<Grid item xs={12}>
						<TextField select fullWidth label="Employee" value={form.employeeNumber} onChange={handleChange('employeeNumber')} disabled={isEdit}>
							{employees.map((emp) => (
								<MenuItem key={emp.employeeNumber} value={emp.employeeNumber}>
									{emp.employeeNumber} - {emp.firstName} {emp.lastName}
								</MenuItem>
							))}
						</TextField>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField type="month" fullWidth label="Month" value={form.month} onChange={handleChange('month')} disabled={isEdit} InputLabelProps={{ shrink: true }} />
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField type="number" fullWidth label="Gross Salary (RWF)" value={form.grossSalary} onChange={handleChange('grossSalary')} inputProps={{ min: 0, step: 100 }} />
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField type="number" fullWidth label="Total Deduction (RWF)" value={form.totalDeduction} onChange={handleChange('totalDeduction')} inputProps={{ min: 0, step: 100 }} />
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField fullWidth label="Net Salary" value={rwfFormatter.format(form.netSalary)} InputProps={{ readOnly: true }} />
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button variant="contained" onClick={handleSubmit}>{isEdit ? 'Save' : 'Create'}</Button>
			</DialogActions>
		</Dialog>
	);
};

export default SalaryForm;
