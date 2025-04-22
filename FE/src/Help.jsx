// c:\Users\Ori\Downloads\FE Project\FE-final-project\FE\src\Help.jsx
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box'; // Import Box for structure

export default function Help() {
  return (
    <Container maxWidth="md"> {/* Use Container for better layout */}
      <Box sx={{ my: 4 }}> {/* Add some margin */}
        <Typography variant="h4" component="h1" gutterBottom>
          Help & User Guide
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}> {/* Wrap sections in Paper */}
          <Typography variant="h6" gutterBottom>
            Getting Started
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to the Student Management Application! This guide will help you navigate and use the system effectively.
          </Typography>
          <Typography variant="body1" paragraph>
            Use the menu icon (☰) in the top-left corner to open the navigation drawer. From there, you can access all major sections of the application.
          </Typography>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Main Features
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Home"
                secondary="The main landing page of the application."
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Students List (/students)"
                secondary="View a table of all registered students. Data is loaded from your browser's local storage."
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Register Student (/students/add)"
                secondary="Access the form to add a new student. Fill in all required fields and click 'Register'. The data will be saved locally."
              />
            </ListItem>
            <Divider component="li" />
             <ListItem>
              <ListItemText
                primary="Info (/Info)"
                secondary="Displays additional information (content to be added)."
              />
            </ListItem>
             <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Help (/Help)"
                secondary="You are here! This page provides guidance on using the application."
              />
            </ListItem>
          </List>
        </Paper>

         <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Managing Student Data
          </Typography>
           <Typography variant="body1" paragraph>
            - **Adding Students:** Navigate to 'Register' from the menu or click the 'Create New Student' button on the Students List page. Fill out the form accurately. Ensure the Student ID is unique.
          </Typography>
           <Typography variant="body1" paragraph>
            - **Viewing Students:** Go to the 'Students' page from the menu to see the list of all saved students.
          </Typography>
           <Typography variant="body1" paragraph>
            - **Data Persistence:** All student data is stored in your web browser's Local Storage. Clearing your browser's data for this site will remove all saved students.
          </Typography>
           <Typography variant="body1" paragraph>
            - **Initial Data:** If no student data is found when you first load the application, a default set of 10 students will be automatically loaded for demonstration purposes.
          </Typography>
           {/* Add sections for editing/deleting if those features are planned */}
        </Paper>

        {/* Add more sections as needed */}

      </Box>
    </Container>
  );
}
