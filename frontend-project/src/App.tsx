import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  IconButton,
  Divider,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LockIcon from '@mui/icons-material/Lock';
import EmployeeList from './components/Employee/EmployeeList';
import DepartmentList from './components/Department/DepartmentList';
import SalaryList from './components/Salary/SalaryList';
import Login from './components/Auth/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import ReportsPage from './components/Reports/ReportsPage';
import { verifyPassword, changePassword } from './services/api';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<{[key: string]: string}>({});
  const [alert, setAlert] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);

  const handleChangePassword = () => {
    setChangePasswordOpen(true);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordErrors({});
  };

  const handleClosePasswordDialog = () => {
    setChangePasswordOpen(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordErrors({});
    setIsVerifyingPassword(false);
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    return '';
  };

  const handlePasswordSubmit = async () => {
    const errors: {[key: string]: string} = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    const newPasswordError = validatePassword(passwordData.newPassword);
    if (newPasswordError) {
      errors.newPassword = newPasswordError;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    // Validate current password matches stored password
    if (passwordData.currentPassword && !errors.currentPassword) {
      setIsVerifyingPassword(true);
      try {
        // TODO: Replace with actual API call to verify current password
        // For now, we'll simulate a check - in real implementation, this would call your backend
        const isValidCurrentPassword = await verifyCurrentPassword(passwordData.currentPassword);
        
        if (!isValidCurrentPassword) {
          errors.currentPassword = 'Current password is incorrect';
        }
      } catch (error) {
        errors.currentPassword = 'Error verifying current password';
      } finally {
        setIsVerifyingPassword(false);
      }
    }

    setPasswordErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        await changePassword(passwordData.currentPassword, passwordData.newPassword);
        setAlert({ message: 'Password changed successfully!', severity: 'success' });
        handleClosePasswordDialog();
      } catch (error: any) {
        setAlert({ message: error?.response?.data?.message || 'Error changing password. Please try again.', severity: 'error' });
      }
    }
  };

  // Verify current password via API
  const verifyCurrentPassword = async (password: string): Promise<boolean> => {
    try {
      const res = await verifyPassword(password);
      return !!res.data?.valid;
    } catch (e) {
      return false;
    }
  };

  const handlePasswordChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    // Clear error when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCloseAlert = () => {
    setAlert(null);
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2, maxWidth: 600 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          User Information
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Username:</strong> {user?.username}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Role:</strong> 
            <Chip 
              label={user?.role} 
              color="primary" 
              variant="outlined" 
              sx={{ ml: 1 }}
            />
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Account Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<LockIcon />}
              onClick={handleChangePassword}
              sx={{ mb: 1 }}
            >
              Change Password
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Need to sign out?
          </Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={logout}
            sx={{ ml: 'auto' }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onClose={handleClosePasswordDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange('currentPassword')}
              error={!!passwordErrors.currentPassword}
              helperText={passwordErrors.currentPassword || (isVerifyingPassword ? 'Verifying current password...' : '')}
              margin="normal"
              required
              disabled={isVerifyingPassword}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange('newPassword')}
              error={!!passwordErrors.newPassword}
              helperText={passwordErrors.newPassword || 'Must be at least 6 characters with uppercase, lowercase, and number'}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange('confirmPassword')}
              error={!!passwordErrors.confirmPassword}
              helperText={passwordErrors.confirmPassword}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog} disabled={isVerifyingPassword}>
            Cancel
          </Button>
          <Button 
            onClick={handlePasswordSubmit} 
            variant="contained"
            disabled={isVerifyingPassword}
          >
            {isVerifyingPassword ? 'Verifying...' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Alert */}
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
    </Box>
  );
};

const drawerWidth = 240;

const Navigation: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  if (!isAuthenticated) return null;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Employees', path: '/', icon: <PeopleIcon /> },
    { text: 'Departments', path: '/departments', icon: <BusinessIcon /> },
    { text: 'Salaries', path: '/salaries', icon: <AttachMoneyIcon /> },
    { text: 'Reports', path: '/reports', icon: <AssessmentIcon /> },
  ];

  const profileItems = [
    { text: 'Profile', path: '/profile', icon: <PersonIcon /> },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          SmartPark EPMS
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={() => isMobile && setMobileOpen(false)}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <Typography variant="overline" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          Account
        </Typography>
        {profileItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={() => isMobile && setMobileOpen(false)}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            SmartPark EPMS
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Navigation />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              mt: 8, // Account for the fixed AppBar
            }}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<PrivateRoute element={<EmployeeList />} />} />
              <Route path="/departments" element={<PrivateRoute element={<DepartmentList />} />} />
              <Route path="/salaries" element={<PrivateRoute element={<SalaryList />} />} />
              <Route path="/reports" element={<PrivateRoute element={<ReportsPage />} />} />
              <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </AuthProvider>
  );
}

export default App;
