import { React } from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import WorkIcon from '@mui/icons-material/Work';
import EventNoteIcon from '@mui/icons-material/EventNote';

const Navbar = () => {
    <div>
        <BottomNavigation>
            <BottomNavigationAction label='Dashboard' icon={<HomeIcon />} />
            <BottomNavigationAction label='Courses' icon={<AnalyticsIcon />} />
            <BottomNavigationAction label='Professors' icon={<WorkIcon />} />
            <BottomNavigationAction label='Curriculum' icon={<EventNoteIcon />} />
        </BottomNavigation>
    </div>

}

export default Navbar;