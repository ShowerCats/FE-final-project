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

export default function Home() {
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [loadingGrades, setLoadingGrades] = useState(true);
  const [error, setError] = useState(null);

  // Simulate fetching data (replace with actual API calls later)
  useEffect(() => {
    // --- Fetch Notifications ---
    setLoadingNotifications(true);
    try {
      const storedNotifications = localStorage.getItem('notifications');
      if (storedNotifications) {
        const allNotifications = JSON.parse(storedNotifications);
        const unread = allNotifications.filter(n => !n.read).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 3); // Sort by newest first
        setRecentNotifications(unread);
      } else {
        setRecentNotifications([]);
      }
    } catch (e) {
      console.error("Failed to load notifications:", e);
      setError(prev => ({ ...prev, notifications: 'Could not load notifications.' }));
    } finally {
      setLoadingNotifications(false);
    }

    // --- Fetch Grades ---
    setLoadingGrades(true);
    try {
      // Using mock grades for now
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
          if (isNaN(dateA)) return 1;
          if (isNaN(dateB)) return -1;
          return dateB - dateA;
      }).slice(0, 3);
      setRecentGrades(recentGradesData);
    } catch (e) {
      console.error("Failed to load grades:", e);
      setError(prev => ({ ...prev, grades: 'Could not load recent grades.' }));
    } finally {
      setLoadingGrades(false);
    }
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom component="h1" sx={{ mb: 4 }}>
        Welcome Back!
      </Typography>

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
            <Button component={RouterLink} to="/schedule" variant="outlined" startIcon={<EventIcon />} fullWidth sx={{ mb: 1 }} disabled> {/* Keep disabled for now */}
              My Schedule
            </Button>
            <Button component={RouterLink} to="/profile" variant="outlined" startIcon={<AccountCircleIcon />} fullWidth disabled> {/* Keep disabled for now */}
              My Profile
            </Button>
          </Paper>
        </Grid>

        {/* Recent Notifications Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" gutterBottom>Recent Notifications</Typography>
            <Divider sx={{ mb: 1 }} />
            {loadingNotifications ? <Typography>Loading...</Typography> :
             error?.notifications ? <Typography color="error">{error.notifications}</Typography> :
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
            {loadingGrades ? <Typography>Loading...</Typography> :
             error?.grades ? <Typography color="error">{error.grades}</Typography> :
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
