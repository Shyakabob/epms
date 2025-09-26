import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import { Department } from '../../types';
import { createDepartment, updateDepartment } from '../../services/api';

interface DepartmentFormProps {
	open: boolean;
	onClose: () => void;
	initialValue?: Department | null;
}

const rwf = new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 });

const DepartmentForm: React.FC<DepartmentFormProps> = ({ open, onClose, initialValue }) => {
	const [form, setForm] = useState<Department>({
		departmentCode: '',
		departmentName: '',
		grossSalary: 0,
		totalDeduction: 0,
	});
	const isEdit = useMemo(() => Boolean(initialValue), [initialValue]);

	useEffect(() => {
		if (initialValue) setForm(initialValue);
		else setForm({ departmentCode: '', departmentName: '', grossSalary: 0, totalDeduction: 0 });
	}, [initialValue, open]);

	const handleChange = (field: keyof Department) => (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = field === 'grossSalary' || field === 'totalDeduction' ? Number(e.target.value) : e.target.value;
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async () => {
		try {
			if (isEdit) await updateDepartment(form.departmentCode, form);
			else await createDepartment(form);
			onClose();
		} catch (e) {}
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>{isEdit ? 'Edit Department' : 'Add Department'}</DialogTitle>
			<DialogContent>
				<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 3fr' }, gap: 2, mt: 0.5 }}>
					<Box>
						<TextField label="Code" fullWidth value={form.departmentCode} onChange={handleChange('departmentCode')} disabled={isEdit} />
					</Box>
					<Box>
						<TextField label="Name" fullWidth value={form.departmentName} onChange={handleChange('departmentName')} />
					</Box>
					<Box>
						<TextField type="number" label="Gross Salary (RWF)" fullWidth value={form.grossSalary} onChange={handleChange('grossSalary')} inputProps={{ min: 0, step: 100 }} />
					</Box>
					<Box>
						<TextField type="number" label="Total Deduction (RWF)" fullWidth value={form.totalDeduction} onChange={handleChange('totalDeduction')} inputProps={{ min: 0, step: 100 }} />
					</Box>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button variant="contained" onClick={handleSubmit}>{isEdit ? 'Save' : 'Create'}</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DepartmentForm;
