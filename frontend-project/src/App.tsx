import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, Box } from '@mui/material';
import EmployeeList from './components/Employee/EmployeeList';
import DepartmentList from './components/Department/DepartmentList';
import SalaryList from './components/Salary/SalaryList';
import Login from './components/Auth/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import ReportsPage from './components/Reports/ReportsPage';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const Navigation: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          SmartPark EPMS
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Employees
        </Button>
        <Button color="inherit" component={Link} to="/departments">
          Departments
        </Button>
        <Button color="inherit" component={Link} to="/salaries">
          Salaries
        </Button>
        <Button color="inherit" component={Link} to="/reports">
          Reports
        </Button>
        <Box sx={{ ml: 2 }}>
          <Typography variant="body2" component="span" sx={{ mr: 2 }}>
            {user?.username} ({user?.role})
          </Typography>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute element={<EmployeeList />} />} />
            <Route path="/departments" element={<PrivateRoute element={<DepartmentList />} />} />
            <Route path="/salaries" element={<PrivateRoute element={<SalaryList />} />} />
            <Route path="/reports" element={<PrivateRoute element={<ReportsPage />} />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
