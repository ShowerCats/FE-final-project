 import React, { useState } from 'react';
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home'; // Import HomeIcon
import Box from '@mui/material/Box';

export default function Header({ pageTitle }) {
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
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        flexGrow: 1,
                        textAlign: 'center',
                        color: '#2c3e50',
                        fontFamily: '"Helvetica Neue", Arial, sans-serif',
                        fontWeight: 600,
                        mx: 2,
                    }}
                >
                    {pageTitle || "ACADEMIC PORTAL"}
                </Typography>

                <Button
                    color="inherit"
                    onClick={() => handleNavigation("/")}
                    startIcon={<HomeIcon />}
                    sx={{ color: '#2c3e50', mr: 1 }}
                >
                    Home
                </Button>
                <Button
                    color="inherit"
                    onClick={() => handleNavigation("/profile")}
                    startIcon={<AccountCircleIcon />}
                    sx={{ color: '#2c3e50', mr: 1 }}
                >
                    My Profile
                </Button>
                <Button
                    color="inherit"
                    onClick={() => console.log("Logout clicked")}
                    sx={{ color: '#2c3e50' }}
                >
                    Logout
                </Button>
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
                            <ListItemButton onClick={() => handleNavigation("/courses")}>
                                <ListItemText primary="Courses" />
                            </ListItemButton>
                            <ListItemButton onClick={() => handleNavigation("/Notifications")}>
                                <ListItemText primary="Notifications" />
                            </ListItemButton>
                            <ListItemButton onClick={() => handleNavigation("/Grades")}>
                                <ListItemText primary="Grades" />
                            </ListItemButton>
                            <ListItemButton onClick={() => handleNavigation("/schedule")}>
                                <ListItemText primary="My Schedule" />
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
