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

export default function Header() {
    const navigate = useNavigate();
    const handleNavigation = (url) => {
        navigate(url);
        setOpen(false);
    };
    const [open, setOpen] = useState(false);
    const toggleDrawer = () => {
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
                >
                    <MenuIcon />
                </IconButton>
                <img
                    src='https://yedion.ono.ac.il/info/images/CollegeLogo.png'
                    onClick={() => handleNavigation("/")}
                    style={{ cursor: 'pointer' }}
                    alt="College Logo - Go to Home"
                />
                <Drawer open={open} onClose={toggleDrawer}>
                    <div style={{ width: "250px" }}>
                        <List>
                            <ListItemButton onClick={() => handleNavigation("/")}>
                                <ListItemText primary="Home" />
                            </ListItemButton>
                            <ListItemButton onClick={() => handleNavigation("/students")}>
                                <ListItemText primary="Students" />
                            </ListItemButton>
                            <ListItemButton onClick={() => handleNavigation("/Students/add")}>
                                <ListItemText primary="Register" />
                            </ListItemButton>
                            <ListItemButton onClick={() => handleNavigation("/Notifications")}>
                                <ListItemText primary="Notifications" />
                            </ListItemButton>
                            <ListItemButton onClick={() => handleNavigation("/Help")}>
                                <ListItemText primary="Help" />
                            </ListItemButton>
                            <ListItemButton onClick={() => handleNavigation("/About")}>
                                <ListItemText primary="About" />
                            </ListItemButton>
                        </List>
                    </div>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
}
