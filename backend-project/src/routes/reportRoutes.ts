import express from 'express';
import { Request, Response } from 'express';
import pool from '../config/database';

const router = express.Router();

// Helper to compute fallback rows from employees/departments when no salaries exist for the month
async function computeFallbackRows() {
	const [rows] = await pool.query<any[]>(
		`SELECT e.departmentCode,
			SUM(d.grossSalary) AS grossTotal,
			SUM(d.totalDeduction) AS deductionTotal,
			SUM(d.grossSalary - d.totalDeduction) AS netTotal
		FROM employees e
		JOIN departments d ON d.departmentCode = e.departmentCode
		GROUP BY e.departmentCode
		ORDER BY e.departmentCode`
	);
	return rows;
}

// GET /api/reports/summary?month=YYYY-MM
router.get('/summary', async (req: Request, res: Response) => {
	try {
		const { month } = req.query as { month?: string };
		if (!month) return res.status(400).json({ message: 'month is required (YYYY-MM)' });

		let [rows] = await pool.query<any[]>(
			`SELECT e.departmentCode,
				SUM(s.grossSalary) AS grossTotal,
				SUM(s.totalDeduction) AS deductionTotal,
				SUM(s.netSalary) AS netTotal
			FROM salaries s
			JOIN employees e ON e.employeeNumber = s.employeeNumber
			WHERE s.month = ?
			GROUP BY e.departmentCode
			ORDER BY e.departmentCode`
		, [month]);

		if (!rows || rows.length === 0) {
			rows = await computeFallbackRows();
		}

		const totals = rows.reduce(
			(acc, r) => {
				acc.grossTotal += Number(r.grossTotal || 0);
				acc.deductionTotal += Number(r.deductionTotal || 0);
				acc.netTotal += Number(r.netTotal || 0);
				return acc;
			},
			{ grossTotal: 0, deductionTotal: 0, netTotal: 0 }
		);

		res.json({ month, perDepartment: rows, totals });
	} catch (error: any) {
		console.error('Report summary error:', error);
		res.status(500).json({ message: 'Error generating summary', error: error?.message || String(error) });
	}
});

// GET /api/reports/summary.csv?month=YYYY-MM
router.get('/summary.csv', async (req: Request, res: Response) => {
	try {
		const { month } = req.query as { month?: string };
		if (!month) return res.status(400).json({ message: 'month is required (YYYY-MM)' });

		let [rows] = await pool.query<any[]>(
			`SELECT e.departmentCode AS Department,
				SUM(s.grossSalary) AS Gross,
				SUM(s.totalDeduction) AS Deduction,
				SUM(s.netSalary) AS Net
			FROM salaries s
			JOIN employees e ON e.employeeNumber = s.employeeNumber
			WHERE s.month = ?
			GROUP BY e.departmentCode
			ORDER BY e.departmentCode`
		, [month]);

		if (!rows || rows.length === 0) {
			const fallback = await pool.query<any[]>(
				`SELECT e.departmentCode AS Department,
					SUM(d.grossSalary) AS Gross,
					SUM(d.totalDeduction) AS Deduction,
					SUM(d.grossSalary - d.totalDeduction) AS Net
				FROM employees e
				JOIN departments d ON d.departmentCode = e.departmentCode
				GROUP BY e.departmentCode
				ORDER BY e.departmentCode`
			);
			rows = fallback[0];
		}

		const header = 'Department,Gross,Deduction,Net\n';
		const body = rows
			.map(r => `${r.Department},${r.Gross},${r.Deduction},${r.Net}`)
			.join('\n');
		const grossTotal = rows.reduce((a, r) => a + Number(r.Gross || 0), 0);
		const deductionTotal = rows.reduce((a, r) => a + Number(r.Deduction || 0), 0);
		const netTotal = rows.reduce((a, r) => a + Number(r.Net || 0), 0);
		const totalsLine = `Totals,${grossTotal},${deductionTotal},${netTotal}`;

		const csv = header + body + (rows.length ? '\n' : '') + totalsLine + '\n';
		res.setHeader('Content-Type', 'text/csv');
		res.setHeader('Content-Disposition', `attachment; filename="summary-${month}.csv"`);
		res.send(csv);
	} catch (error: any) {
		console.error('Report CSV error:', error);
		res.status(500).json({ message: 'Error generating CSV', error: error?.message || String(error) });
	}
});

export default router;
