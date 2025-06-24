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
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';

import { useLoading } from './contexts/LoadingContext.jsx';
import { firestore as db } from './Firebase/config.js';
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

export default function Home() {
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const { isLoadingGlobal, setIsLoadingGlobal } = useLoading();

  const [loadingSections, setLoadingSections] = useState({ notifications: true, grades: true });
  const [error, setError] = useState({ notifications: null, grades: null, general: null });

  useEffect(() => {
    const fetchHomePageData = async () => {
      setIsLoadingGlobal(true);
      setError({ notifications: null, grades: null, general: null });
      setLoadingSections({ notifications: true, grades: true });

      try {
        // --- Define Firestore queries ---
        const notificationsQuery = query(
          collection(db, "notifications"),
          orderBy("timestamp", "desc"),
          limit(3)
        );
        const notificationsPromise = getDocs(notificationsQuery);

        // This query now filters out 'Pending' grades and will require a composite index.
        const gradesQuery = query(
          collection(db, "grades"),
          where("grade", "!=", "Pending"),
          orderBy("date", "desc"),
          limit(3)
        );
        const gradesPromise = getDocs(gradesQuery);

        // --- Fetch data in parallel ---
        const results = await Promise.allSettled([notificationsPromise, gradesPromise]);

        // Process notifications result
        if (results[0].status === 'fulfilled') {
          const notificationsData = results[0].value.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRecentNotifications(notificationsData);
        } else {
          // Log the specific Firestore error to the console.
          // This will often contain a link to create a required index.
          console.error("Firestore Error - Failed to load notifications:", results[0].reason);
          setError(prev => ({ ...prev, notifications: 'Could not load notifications.' }));
        }

        // Process grades result
        if (results[1].status === 'fulfilled') {
          const gradesData = results[1].value.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRecentGrades(gradesData);
        } else {
          // Log the specific Firestore error for grades.
          console.error("Firestore Error - Failed to load grades:", results[1].reason);
          setError(prev => ({ ...prev, grades: 'Could not load recent grades.' }));
        }

      } catch (e) {
        console.error("General error fetching home page data:", e);
        setError(prev => ({ ...prev, general: 'Could not load dashboard data.' }));
      } finally {
        setLoadingSections({ notifications: false, grades: false });
        setIsLoadingGlobal(false);
      }
    };

    fetchHomePageData();
  }, [setIsLoadingGlobal]);

  if (isLoadingGlobal) {
    return null;
  }

  return (
    <Box sx={{
        p: 3,
        width: '100%',
        maxWidth: '1200px',
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
            ) : <Typography variant="body2">No recent notifications.</Typography>}
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