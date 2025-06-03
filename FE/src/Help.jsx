// c:\Users\Ori\Downloads\FE Project\FE-final-project\FE\src\Help.jsx
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

export default function Help() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Help & User Guide
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
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
                primary="Home (/)"
                secondary="The main dashboard providing quick links and summaries of recent activity."
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Students List (/students)"
                secondary="View a table of all registered students. Data is loaded from the Firebase Firestore database."
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Add Student (/students/add)"
                secondary="Access the form to add a new student. Fill in all required fields and click 'Register'. The data will be saved to Firebase."
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Edit Student (/students/edit/:studentId)"
                secondary="Modify the details of an existing student. Accessible from the 'Students List' page."
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Notifications (/notifications)"
                secondary="View important announcements and updates. Data is loaded from Firebase."
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Courses (/courses)"
                secondary="Displays information about available courses (content to be added/fetched from Firebase)."
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Grades (/grades)"
                secondary="View your grades for assignments and exams (content to be added/fetched from Firebase)."
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Info (/info)"
                secondary="Displays general information about the application or institution."
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="About (/about)"
                secondary="Information about the application version and development."
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText
                primary="Help (/help)"
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
            - **Adding Students:** Navigate to 'Students' from the menu, then click the 'Add New Student' button. Alternatively, go directly to '/students/add'. Fill out the form accurately. Ensure the Student ID is unique if not auto-generated.
          </Typography>
           <Typography variant="body1" paragraph>
            - **Viewing Students:** Go to the 'Students' page from the menu to see the list of all saved students.
          </Typography>
           <Typography variant="body1" paragraph>
            - **Editing Students:** On the 'Students List' page, click the 'Edit' button next to a student's record to modify their information.
          </Typography>
           <Typography variant="body1" paragraph>
            - **Data Persistence:** All student and notification data is stored securely in the Firebase Firestore cloud database.
          </Typography>
           <Typography variant="body1" paragraph>
            - **Initial Data:** If no student or notification data is found when the application first loads, a default set of data will be automatically populated into Firebase for demonstration purposes.
          </Typography>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Troubleshooting
          </Typography>
          <Typography variant="body1" paragraph>
            - **Page Not Loading Correctly?** Try refreshing the page (Ctrl+R or Cmd+R). If the issue persists, check your internet connection.
          </Typography>
          <Typography variant="body1" paragraph>
            - **Unable to Save Data?** Ensure all required fields in forms are filled correctly. Check for any error messages displayed on the screen.
          </Typography>
          <Typography variant="body1" paragraph>
            - **Contact Support:** If you encounter persistent issues or have questions not covered here, please reach out to the system administrator.
          </Typography>
        </Paper>

      </Box>
    </Container>
  );
}