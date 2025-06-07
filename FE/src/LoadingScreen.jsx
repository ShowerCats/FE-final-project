import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darker, semi-transparent background
        zIndex: 9999, // Ensure it's on top of other content
        backdropFilter: 'blur(4px)', // Adds a blur effect to the background
      }}>
      <Paper
        elevation={6} // Adds a nice shadow
        sx={{
          padding: 4, // Increased padding
          borderRadius: 2, // Slightly rounded corners
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '200px', // Ensure a minimum width for the paper
          backgroundColor: 'background.paper', // Use theme's paper background
        }}
      >
        <CircularProgress size={50} sx={{ mb: 2 }} /> {/* Adjusted size and margin */}
        <Typography variant="h6" component="div" sx={{ color: 'text.secondary' }}>
          Loading...
        </Typography>
      </Paper>
    </Box>
  );
}