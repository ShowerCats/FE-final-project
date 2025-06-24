import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Avatar,
  Grid,
  TextField,
  Button,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useLoading } from './contexts/LoadingContext.jsx';

const mockUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  studentId: 'S12345',
  major: 'Computer Science',
  profileImageUrl: '',
};

export default function Profile() {
  const { isLoadingGlobal, setIsLoadingGlobal } = useLoading();
  const [user, setUser] = useState(null); // Initialize as null or empty object
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setIsLoadingGlobal(true);
    setTimeout(() => {
      setUser(mockUser); // In a real app, fetch from backend/auth context
      setFormData(mockUser); // Initialize form data
      setIsLoadingGlobal(false);
  }, 100); // Shorter delay
  }, [setIsLoadingGlobal]);

  if (isLoadingGlobal || !user) { // Also wait for user data to be set
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          My Profile
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName || ''}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
              variant={editMode ? "outlined" : "standard"}
              InputProps={{ disableUnderline: !editMode }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName || ''}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
              variant={editMode ? "outlined" : "standard"}
              InputProps={{ disableUnderline: !editMode }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
              variant={editMode ? "outlined" : "standard"}
              InputProps={{ disableUnderline: !editMode }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Student ID"
              name="studentId"
              value={formData.studentId || ''}
              fullWidth
              disabled // Student ID usually not editable
              variant={"standard"}
              InputProps={{ disableUnderline: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Major"
              name="major"
              value={formData.major || ''}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
              variant={editMode ? "outlined" : "standard"}
              InputProps={{ disableUnderline: !editMode }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          {editMode ? (
            <>
              <Button variant="outlined" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button variant="contained" onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleSaveProfile() {
    setUser(formData); // Update the main user state
    // In a real app, you would also send this data to your backend here
    setEditMode(false);
    alert('Profile updated successfully! (Locally)');
  }

  function handleCancelEdit() {
    setFormData(user); // Reset form data to the original user data
    setEditMode(false);
  }
}