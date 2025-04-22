// src/About.jsx
import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function About() {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4">About This Application</Typography>
      <Typography variant="body1">
        [We are a new team hired by ONO ACADEMY specifically to improve the notification system!]
      </Typography>
    </Box>
  );
}

export default About;
