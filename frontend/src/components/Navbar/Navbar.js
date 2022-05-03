import { useState } from 'react';
import logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom';
import { BiUserCircle } from 'react-icons/bi';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Avatar, Box, Button,
  ButtonGroup, Tooltip,
  IconButton, Menu, MenuItem,
  Typography, Toolbar, Container,
  AppBar
} from '@mui/material';
import "./Navbar.scss"

const Navbar = () => {
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem("user_id");
  const pages = [
  { name: 'Dashboard', action: () => navigate("/dashboard") },
  { name: 'Courses', action: () => navigate("/courses") },
  { name: 'Instructors', action: () => navigate("/instructors") },
  { name: 'Curriculum', action: () => navigate("/curriculum") }];

  const settings = [
  {name: 'Profile', action: null /* to be implemented*/}, 
  {name: 'Logout', action: () => { 
    localStorage.removeItem("user_id"); 
    navigate("/"); 
  }}];

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  if (window.location.pathname !== "/login" && window.location.pathname !== "/create-account") {
    if (loggedInUser) {
      return (
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box
                noWrap
                component="img"
                width="225px"
                sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                src={logo}
              />

              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page.name} onClick={page.action}>
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <Container
                noWrap
                sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
              >
                <img className='center-logo' alt='MyUniPerformance logo' src={logo} />
              </Container>
              <Box sx={{ flexGrow: 1, paddingLeft: 2.5, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                  <Button
                    key={page.name}
                    onClick={page.action}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page.name}
                  </Button>
                ))}
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting.name} onClick={setting.action}>
                      <Typography textAlign="center">{setting.name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      );
    }
    else {
      return (
        <AppBar position='static' elevation={0}>
          <Toolbar>
            <img className="center-logo" alt='MyUniPerformance logo' src={logo} /> {/* Page Routes Navbar */}
            <Button style={{
              border: '1px solid',
              borderColor: "white",
              padding: "8px 14px",
              fontSize: "14px",
              position: "absolute",
              right: 10
            }} variant="contained" onClick={() => { navigate("/login"); }}>
              <BiUserCircle style={{ paddingRight: 5 }} size={25} />Sign In
            </Button>
          </Toolbar>
        </AppBar>
      );
    }
  }
  else {
    return null;
  }

};
export default Navbar;