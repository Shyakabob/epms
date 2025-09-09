import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Stack, Alert } from '@mui/material';
import { getReportSummary, downloadReportCsv, ReportSummary } from '../../services/api';

const rwf = new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 });

const ReportsPage: React.FC = () => {
	const [month, setMonth] = useState<string>('');
	const [data, setData] = useState<ReportSummary | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const now = new Date();
		const m = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
		setMonth(m);
		// auto-load
		load(m);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const load = async (m: string) => {
		try {
			setError(null);
			setLoading(true);
			const res = await getReportSummary(m);
			setData(res.data);
		} catch (e: any) {
			setData(null);
			setError(e?.response?.data?.message || 'Failed to generate report');
		} finally {
			setLoading(false);
		}
	};

	const onDownload = async () => {
		try {
			const res = await downloadReportCsv(month);
			const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `summary-${month}.csv`);
			document.body.appendChild(link);
			link.click();
			link.parentNode?.removeChild(link);
		} catch (e: any) {
			setError(e?.response?.data?.message || 'Failed to download CSV');
		}
	};

	return (
		<Box>
			<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
				<Typography variant="h4">Reports</Typography>
				<Stack direction="row" spacing={1}>
					<TextField type="month" size="small" value={month} onChange={(e) => setMonth(e.target.value)} />
					<Button variant="outlined" onClick={() => load(month)} disabled={!month || loading}>Generate</Button>
					<Button variant="contained" onClick={onDownload} disabled={!data}>Download CSV</Button>
				</Stack>
			</Stack>

			{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Department</TableCell>
							<TableCell align="right">Gross</TableCell>
							<TableCell align="right">Deduction</TableCell>
							<TableCell align="right">Net</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.perDepartment.map((r) => (
							<TableRow key={r.departmentCode}>
								<TableCell>{r.departmentCode}</TableCell>
								<TableCell align="right">{rwf.format(r.grossTotal)}</TableCell>
								<TableCell align="right">{rwf.format(r.deductionTotal)}</TableCell>
								<TableCell align="right">{rwf.format(r.netTotal)}</TableCell>
							</TableRow>
						))}
						{data && (
							<TableRow>
								<TableCell><strong>Totals</strong></TableCell>
								<TableCell align="right"><strong>{rwf.format(data.totals.grossTotal)}</strong></TableCell>
								<TableCell align="right"><strong>{rwf.format(data.totals.deductionTotal)}</strong></TableCell>
								<TableCell align="right"><strong>{rwf.format(data.totals.netTotal)}</strong></TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default ReportsPage;
