import { useState } from 'react';
import logo from '../../assets/logo.png'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useNavigate } from 'react-router-dom';
import { BiUserCircle } from 'react-icons/bi';
import { Avatar, Box, Button, ButtonGroup, Tooltip, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import "./Navbar.scss"

const Navbar = () => {
  let loggedInUser = localStorage.getItem("user_id");
  let navigate = useNavigate();
  const [accountSettingsToggle, setAccountSettingsToggle] = useState();

  const handleOpenUserMenu = () => {
    setAccountSettingsToggle(true);
  };

  const handleCloseUserMenu = () => {
    setAccountSettingsToggle(false);
  };

  if (window.location.pathname != "/login" && window.location.pathname != "/create-account") {
    if (loggedInUser) {
      return (
        <AppBar position='static' elevation={0}>
          <Toolbar>
            <img className="left-logo" src={logo} /> {/* Page Routes Navbar */} <ButtonGroup variant="contained" size='large' color='primary' sx={{
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
              boxShadow: 'none',
            }}>
              <Button onClick={() => { navigate("/dashboard") }}> Dashboard </Button>
              <Button onClick={() => { navigate("/professors") }}> Professors </Button>
              <Button onClick={() => { navigate("/courses") }}> Courses </Button>
              <Button onClick={() => { navigate("/curriculum") }}> Curriculum </Button>
            </ButtonGroup> {/* Account Settings */} <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} style={{
                  position: "absolute",
                  top: 15,
                  right: 15,
                }} sx={{ p: 0 }}>
                  <Avatar />
                </IconButton>
              </Tooltip>
              <Menu sx={{ mt: '45px' }} id="menu-appbar" anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }} keepMounted transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }} open={accountSettingsToggle} onClose={handleCloseUserMenu}>
                <MenuItem key="account" onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Account</Typography>
                </MenuItem>
                <MenuItem key="setting" onClick={() => { localStorage.removeItem("user_id"); navigate("/"); }}> <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>)
    }
    else {
      return (
        <AppBar position='static' elevation={0}>
          <Toolbar>
            <img className="center-logo" src={logo} /> {/* Page Routes Navbar */}
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
    return false;
  }

};
export default Navbar;