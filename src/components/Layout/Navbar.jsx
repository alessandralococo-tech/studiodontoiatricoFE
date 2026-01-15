import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, IconButton, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';

// Icona dente stilizzata
const ToothIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2C9.5,2 7.5,3.5 6.5,5.5C5.5,7.5 5,10 5,12C5,14.5 5.5,16.5 6.5,18C7,18.75 7.5,19.25 8,19.5C8.5,19.75 8.75,19.75 9,19.75C9.5,19.75 10,19.5 10.5,19C11,18.5 11.5,17.5 12,16C12.5,17.5 13,18.5 13.5,19C14,19.5 14.5,19.75 15,19.75C15.25,19.75 15.5,19.75 16,19.5C16.5,19.25 17,18.75 17.5,18C18.5,16.5 19,14.5 19,12C19,10 18.5,7.5 17.5,5.5C16.5,3.5 14.5,2 12,2M12,4C13.5,4 15,5 15.5,6.5C16,8 16.5,10 16.5,12C16.5,13.5 16.25,15 15.75,16C15.5,16.5 15.25,16.75 15,17C15,17 14.75,17 14.5,16.75C14.25,16.5 14,16 13.5,15C13,14 12.5,12.5 12,11C11.5,12.5 11,14 10.5,15C10,16 9.75,16.5 9.5,16.75C9.25,17 9,17 9,17C8.75,16.75 8.5,16.5 8.25,16C7.75,15 7.5,13.5 7.5,12C7.5,10 8,8 8.5,6.5C9,5 10.5,4 12,4Z"/>
  </svg>
);

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    dispatch(logout());
    navigate('/login');
  };

  const handleMyAppointments = () => {
    handleMenuClose();
    navigate('/my-appointments');
  };

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <AppBar 
      position="sticky"
      elevation={0}
      sx={{ 
        background: 'linear-gradient(90deg, #FFFFFF 0%, #F0F9FF 100%)',
        boxShadow: '0 2px 12px rgba(0, 180, 216, 0.1)',
        borderBottom: '1px solid #CAF0F8',
        borderRadius: 0
      }}
    >
      <Toolbar sx={{ py: 1.5, px: { xs: 2, md: 4 } }}>
        {/* Logo e Brand */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexGrow: 1, 
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'scale(1.02)',
            }
          }}
          onClick={() => navigate('/')}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #00B4D8 0%, #0096C7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 180, 216, 0.3)',
            }}
          >
            <ToothIcon />
          </Box>
          <Box>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                letterSpacing: '-0.5px',
                background: 'linear-gradient(135deg, #00B4D8 0%, #0096C7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2
              }}
            >
              SmileCare
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#48CAE4',
                fontWeight: 600,
                letterSpacing: '1px'
              }}
            >
              STUDIO DENTISTICO
            </Typography>
          </Box>
        </Box>

        {/* Navigation */}
        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            
            {/* User Buttons */}
            {user?.role === 'ROLE_USER' && (
              <Button 
                color="inherit" 
                onClick={() => navigate('/doctors')}
                startIcon={<CalendarMonthIcon />}
                sx={{ 
                  fontWeight: 600,
                  px: 2.5,
                  py: 1,
                  borderRadius: '12px',
                  color: '#00B4D8',
                  bgcolor: '#F0F9FF',
                  border: '1px solid #CAF0F8',
                  '&:hover': {
                    bgcolor: '#E0F7FA',
                    borderColor: '#00B4D8',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 180, 216, 0.2)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                Prenota
              </Button>
            )}

            {/* Admin Button */}
            {user?.role === 'ROLE_ADMIN' && (
              <Button 
                color="inherit" 
                onClick={() => navigate('/doctor-dashboard')}
                startIcon={<DashboardIcon />}
                sx={{ 
                  fontWeight: 600,
                  px: 2.5,
                  py: 1,
                  borderRadius: '12px',
                  color: '#00B4D8',
                  bgcolor: '#F0F9FF',
                  border: '1px solid #CAF0F8',
                  '&:hover': {
                    bgcolor: '#E0F7FA',
                    borderColor: '#00B4D8',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 180, 216, 0.2)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                Dashboard
              </Button>
            )}

            {/* Profile Menu */}
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                ml: 1,
                border: '2px solid #CAF0F8',
                bgcolor: '#F0F9FF',
                '&:hover': {
                  bgcolor: '#E0F7FA',
                  borderColor: '#00B4D8',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s'
              }}
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36,
                  bgcolor: '#00B4D8',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1rem'
                }}
              >
                {getUserInitials()}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 220,
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 180, 216, 0.15)',
                  border: '1px solid #CAF0F8'
                }
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#00B4D8' }}>
                  {user?.email}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {user?.role === 'ROLE_ADMIN' ? 'Medico' : 'Paziente'}
                </Typography>
              </Box>
              <Divider />
              
              {user?.role === 'ROLE_USER' && (
                <MenuItem 
                  onClick={handleMyAppointments}
                  sx={{
                    py: 1.5,
                    '&:hover': {
                      bgcolor: '#F0F9FF',
                      color: '#00B4D8'
                    }
                  }}
                >
                  <EventAvailableIcon sx={{ mr: 1.5, fontSize: 20 }} />
                  I Miei Appuntamenti
                </MenuItem>
              )}
              
              <MenuItem 
                onClick={handleMenuClose}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    bgcolor: '#F0F9FF',
                    color: '#00B4D8'
                  }
                }}
              >
                <PersonIcon sx={{ mr: 1.5, fontSize: 20 }} />
                Profilo
              </MenuItem>
              
              <Divider />
              
              <MenuItem 
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  color: '#d32f2f',
                  '&:hover': {
                    bgcolor: '#ffebee',
                  }
                }}
              >
                <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Login Button */}
            <Button 
              color="inherit" 
              onClick={() => navigate('/login')}
              startIcon={<LoginIcon />}
              sx={{ 
                fontWeight: 600,
                px: 3,
                py: 1.2,
                borderRadius: '12px',
                border: '2px solid #CAF0F8',
                color: '#00B4D8',
                bgcolor: '#F0F9FF',
                '&:hover': {
                  bgcolor: '#E0F7FA',
                  borderColor: '#00B4D8',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 180, 216, 0.15)'
                },
                transition: 'all 0.2s'
              }}
            >
              Login
            </Button>

            {/* Register Button */}
            <Button 
              color="inherit" 
              onClick={() => navigate('/register')}
              startIcon={<PersonAddIcon />}
              sx={{ 
                fontWeight: 700,
                px: 3,
                py: 1.2,
                borderRadius: '12px',
                bgcolor: '#00B4D8',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(0, 180, 216, 0.3)',
                '&:hover': {
                  bgcolor: '#0096C7',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 20px rgba(0, 180, 216, 0.4)'
                },
                transition: 'all 0.2s'
              }}
            >
              Registrati
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;