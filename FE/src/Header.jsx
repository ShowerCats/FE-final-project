import React from 'react'
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Header()
{  
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
    <>
     <AppBar>
 <Toolbar>
 <IconButton
 size="large"
 edge="start"
 color="inherit"
 onClick={toggleDrawer}
 >
 <MenuIcon />
 </IconButton>
 <Drawer open={open} onClose={toggleDrawer}>
 <div style={{ width: "250px" }}>
 <List>
 <ListItem onClick={() => handleNavigation("/")}>
 <ListItemText primary="Home" />
 </ListItem>
 <ListItem onClick={() => handleNavigation("/Help")}>
 <ListItemText primary="Help" />
 </ListItem>
 </List>
  </div>
 </Drawer>
 </Toolbar>
 </AppBar>
    <IconButton size="large" edge="start" color="inherit">
 <MenuIcon />
 </IconButton>
 </>
  )
}
