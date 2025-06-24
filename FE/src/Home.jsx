import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import NotificationsIcon from '@mui/icons-material/Notifications';
import GradeIcon from '@mui/icons-material/Grade';
import EventIcon from '@mui/icons-material/Event';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SchoolIcon from '@mui/icons-material/School'; // For Courses
import AssignmentIcon from '@mui/icons-material/Assignment'; // For Grades page link

import { useLoading } from './contexts/LoadingContext.jsx'; // Import useLoading

export default function Home() {
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const { isLoadingGlobal, setIsLoadingGlobal } = useLoading(); // Use global loading

  // Local loading states for individual sections, if needed for more granular feedback
  // or if sections might reload independently later.
  const [loadingSections, setLoadingSections] = useState({ notifications: true, grades: true });
  const [error, setError] = useState({ notifications: null, grades: null, general: null });

  useEffect(() => {
    const fetchHomePageData = async () => {
      setIsLoadingGlobal(true);
      setError({ notifications: null, grades: null, general: null }); // Reset errors
      setLoadingSections({ notifications: true, grades: true }); // Reset section loading

      await new Promise(resolve => setTimeout(resolve, 150)); // Changed to 100ms delay

      try {
        // --- Fetch Notifications ---
        try {
          const storedNotifications = localStorage.getItem('notifications');
          if (storedNotifications) {
            const allNotifications = JSON.parse(storedNotifications);
            const unread = allNotifications.filter(n => !n.read).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 3);
            setRecentNotifications(unread);
          } else {
            setRecentNotifications([]);
          }
        } catch (e) {
          console.error("Failed to load notifications:", e);
          setError(prev => ({ ...prev, notifications: 'Could not load notifications.' }));
        } finally {
          setLoadingSections(prev => ({ ...prev, notifications: false }));
        }

        // --- Fetch Grades ---
        try {
          const mockGradesFromStorage = [
            { id: 1, course: 'Intro to Programming', assignment: 'Midterm Exam', grade: 'A-', date: '2024-05-10' },
            { id: 2, course: 'Calculus I', assignment: 'Homework 5', grade: 'B+', date: '2024-05-12' },
            { id: 3, course: 'Intro to Programming', assignment: 'Assignment 3', grade: 'A', date: '2024-05-01' },
            { id: 4, course: 'Linear Algebra', assignment: 'Quiz 2', grade: 'C', date: '2024-04-28' },
            { id: 5, course: 'Data Structures', assignment: 'Project 1', grade: 'Pending', date: 'N/A' },
          ];
          const recentGradesData = mockGradesFromStorage.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (isNaN(dateA) && isNaN(dateB)) return 0;
            if (isNaN(dateA)) return 1; // Sort NaNs to the end
            if (isNaN(dateB)) return -1; // Sort NaNs to the end
            return dateB - dateA; // Sort by most recent date first
          }).slice(0, 3);
          setRecentGrades(recentGradesData);
        } catch (e) {
          console.error("Failed to load grades:", e);
          setError(prev => ({ ...prev, grades: 'Could not load recent grades.' }));
        } finally {
          setLoadingSections(prev => ({ ...prev, grades: false }));
        }

      } catch (e) {
        // This catch block is for errors during the setup of the try-catch blocks themselves,
        // or if an error isn't caught by the inner try-catch blocks.
        console.error("General error fetching home page data:", e);
        setError(prev => ({ ...prev, general: 'Could not load dashboard data.' }));
      } finally {
        setIsLoadingGlobal(false); // Turn off global loader once all attempts are made
      }
    };

    fetchHomePageData();
  }, [setIsLoadingGlobal]); // Dependency array includes setIsLoadingGlobal

  // If global loading is active, LoadingScreen will be shown by App.jsx
  if (isLoadingGlobal) {
    return null; // Render nothing from this component, LoadingScreen in App.jsx will be visible
  }

  return (
    <Box sx={{
        p: 3, // Page-specific padding
        width: '100%',
        maxWidth: '1200px', // Sets a max-width for the Home page content area
      }}>
      <Typography variant="h4" gutterBottom component="h1" sx={{ mb: 4, textAlign: 'center' }}>
        Welcome Back!
      </Typography>

      {error.general && <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>{error.general}</Typography>}

      <Grid container spacing={3}>
        {/* Quick Links Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" gutterBottom>Quick Links</Typography>
            <Divider sx={{ mb: 2 }} />
            <Button component={RouterLink} to="/courses" variant="outlined" startIcon={<SchoolIcon />} fullWidth sx={{ mb: 1 }}>
              My Courses
            </Button>
            <Button component={RouterLink} to="/grades" variant="outlined" startIcon={<AssignmentIcon />} fullWidth sx={{ mb: 1 }}>
              My Grades
            </Button>
            <Button component={RouterLink} to="/schedule" variant="outlined" startIcon={<EventIcon />} fullWidth sx={{ mb: 1 }}>
              My Schedule
            </Button>
            <Button component={RouterLink} to="/profile" variant="outlined" startIcon={<AccountCircleIcon />} fullWidth>
              My Profile
            </Button>
          </Paper>
        </Grid>

        {/* Recent Notifications Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" gutterBottom>Recent Notifications</Typography>
            <Divider sx={{ mb: 1 }} />
            {loadingSections.notifications ? <Typography>Loading notifications...</Typography> :
             error.notifications ? <Typography color="error">{error.notifications}</Typography> :
             recentNotifications.length > 0 ? (
              <List dense sx={{ overflow: 'auto', maxHeight: 250 }}>
                {recentNotifications.map((notif) => (
                  <ListItem key={notif.id} disablePadding>
                    <ListItemIcon sx={{ minWidth: '40px' }}><NotificationsIcon fontSize="small" color="primary" /></ListItemIcon>
                    <ListItemText primary={notif.message} secondary={`From: ${notif.sender}`} />
                  </ListItem>
                ))}
              </List>
            ) : <Typography variant="body2">No unread notifications.</Typography>}
            <Button component={RouterLink} to="/notifications" size="small" sx={{ mt: 'auto', alignSelf: 'flex-end' }}>View All</Button>
          </Paper>
        </Grid>

        {/* Recent Grades Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" gutterBottom>Recent Grades</Typography>
            <Divider sx={{ mb: 1 }} />
            {loadingSections.grades ? <Typography>Loading grades...</Typography> :
             error.grades ? <Typography color="error">{error.grades}</Typography> :
             recentGrades.length > 0 ? (
              <List dense sx={{ overflow: 'auto', maxHeight: 250 }}>
                {recentGrades.map((grade) => (
                  <ListItem key={grade.id} disablePadding>
                    <ListItemIcon sx={{ minWidth: '40px' }}><GradeIcon fontSize="small" color="secondary" /></ListItemIcon>
                    <ListItemText primary={`${grade.course} - ${grade.assignment}`} secondary={`Grade: ${grade.grade} (${grade.date})`} />
                  </ListItem>
                ))}
              </List>
            ) : <Typography variant="body2">No recent grades posted.</Typography>}
            <Button component={RouterLink} to="/grades" size="small" sx={{ mt: 'auto', alignSelf: 'flex-end' }}>View All Grades</Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
