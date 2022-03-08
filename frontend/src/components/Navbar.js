import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonGroup } from '@mui/material';
import { green } from '@mui/material/colors';

const pages = ['Dashboard', 'Professors', 'Courses', 'Curriculum'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

/* const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
}));
 */
const Navbar = () => {
    //const classes = useStyles();
    let navigate = useNavigate();
    return (
        <AppBar position='static'>
            <Toolbar>
                <ButtonGroup
                    variant="text"
                    size='large'
                    fullWidth='true'
                    color='inherit'
                >
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