import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, ButtonGroup, Tooltip, IconButton, Menu, MenuItem, Typography } from '@mui/material';

const settings = ['Account', 'Dashboard', 'Logout'];

const Navbar = () => {
    //const classes = useStyles();
    let navigate = useNavigate();
    const [accountSettingsToggle, setAccountSettingsToggle] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAccountSettingsToggle(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAccountSettingsToggle(null);
    };

    return (
        <AppBar position='static' elevation={0}>
            <Toolbar>
                {/* Page Routes Navbar */}
                <ButtonGroup
                    variant="contained"
                    size='large'
                    color='primary'
                    sx={{
                        display: 'flex',
                        flex: 1,
                        justifyContent: 'center',
                        boxShadow: 'none',
                    }}>
                    <Button onClick={() => {
                        navigate("/dashboard")
                    }}>
                        Dashboard
                    </Button>
                    <Button onClick={() => {
                        navigate("/professors")
                    }}>
                        Professors
                    </Button>
                    <Button onClick={() => {
                        navigate("/courses")
                    }}>
                        Courses
                    </Button>
                    <Button onClick={() => {
                        navigate("/curriculum")
                    }}>
                        Curriculum
                    </Button>
                </ButtonGroup>

                {/* Account Settings */}
                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={accountSettingsToggle}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(accountSettingsToggle)}
                        onClose={handleCloseUserMenu}
                    >
                        {settings.map((setting) => (
                            <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                <Typography textAlign="center">{setting}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
export default Navbar;


/*<BottomNavigation>
    <BottomNavigationAction
        component={NavLink}
        to="/dashboard"
        label='Dashboard-Navbar'
        value='Dashboard'
        icon={<HomeIcon />} />
    <BottomNavigationAction
        component={NavLink}
        to="/courses"
        label='Courses-Navbar'
        value='Courses'
        icon={<AnalyticsIcon />} />
    <BottomNavigationAction
        component={NavLink}
        to="/professors"
        label='Professors-Navbar'
        value='Professors'
        icon={<WorkIcon />} />
    <BottomNavigationAction
        component={NavLink}
        to="/curriculum"
        label='Curriculum-Navbar'
        value='Curriculum'
        icon={<EventNoteIcon />} />
</BottomNavigation> */