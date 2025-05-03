import React, { useState } from 'react';
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';

export default function Header() {
    const navigate = useNavigate();
    const handleNavigation = (url) => {
        navigate(url);
        setOpen(false);
    };
    const [open, setOpen] = useState(false);
    const toggleDrawer = (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(!open);
    };

    return (
        <AppBar position="fixed" style={{backgroundColor: "greenyellow"}} >
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    onClick={toggleDrawer}
                    sx={{ mr: 2, color: '#333' }}
                >
                    <MenuIcon />
                </IconButton>
                <img
                    src='https://yedion.ono.ac.il/info/images/CollegeLogo.png'
                    onClick={() => handleNavigation("/")}
                    style={{ cursor: 'pointer', height: '40px' }}
                    alt="College Logo - Go to Home"
                />
                <Drawer anchor="left" open={open} onClose={toggleDrawer}>
                    <Box
                        sx={{ width: 250 }}
                        role="presentation"
                        onClick={toggleDrawer}
                        onKeyDown={toggleDrawer}
                    >
                        <List>
                            <ListItemButton onClick={() => handleNavigation("/")}>
                                <ListItemText primary="Home" />
                            </ListItemButton>
                            <ListItemButton onClick={() => handleNavigation("/students")}>
                                <ListItemText primary="Students" />
                            </ListItemButton>
                            <ListItemButton onClick={() => handleNavigation("/students/add")}>
                                <ListItemText primary="Register Student" />
                            </ListItemButton>
                            {/* Add Courses Link Here */}
                            <ListItemButton onClick={() => handleNavigation("/courses")}>
                                <ListItemText primary="Courses" />
                            </ListItemButton>
                            {/* End Add Courses Link */}
                            <ListItemButton onClick={() => handleNavigation("/Notifications")}>
                                <ListItemText primary="Notifications" />
                            </ListItemButton>
                            <ListItemButton onClick={() => handleNavigation("/Grades")}>
                                <ListItemText primary="Grades" />
                            </ListItemButton>
                            <ListItemButton onClick={() => handleNavigation("/Help")}>
                                <ListItemText primary="Help" />
                            </ListItemButton>
                            <ListItemButton onClick={() => handleNavigation("/About")}>
                                <ListItemText primary="About" />
                            </ListItemButton>
                        </List>
                    </Box>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
}
