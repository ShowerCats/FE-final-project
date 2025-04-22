// c:\Users\Ori\Downloads\FE Project\FE-final-project\FE\src\StudentsForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert'; // Import Alert for error messages

function StudentsForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    major: '',
    dateOfBirth: '',
    phoneNumber: '',
    address: '',
  });
  // Add state for validation errors
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(''); // General error on submit

  const validateField = (name, value) => {
    let error = '';
    if (!value) {
      error = 'This field is required';
    } else {
      switch (name) {
        case 'email':
          // Basic email regex
          if (!/\S+@\S+\.\S+/.test(value)) {
            error = 'Email address is invalid';
          }
          break;
        case 'phoneNumber':
          // Basic phone regex (e.g., 10 digits) - adjust as needed
          if (!/^\d{10}$/.test(value.replace(/-/g, ''))) { // Allow dashes but validate 10 digits
            error = 'Phone number must be 10 digits';
          }
          break;
        case 'studentId':
          // Must contain only numbers
          if (!/^\d+$/.test(value)) { // <--- MODIFIED LINE
            error = 'Student ID must contain only numbers'; // <--- MODIFIED LINE
          }
          break;
        // Add more specific validations if needed (e.g., date format)
        default:
          break;
      }
    }
    return error;
  };


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Validate on change and clear error if valid
    const error = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error, // Set error message or empty string if valid
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitError(''); // Clear previous submit error

    if (!validateForm()) {
      setSubmitError('Please fix the errors in the form.');
      return; // Stop submission if validation fails
    }

    try {
      const existingStudents = JSON.parse(localStorage.getItem('students')) || [];
      // Check for duplicate Student ID before adding
      if (existingStudents.some(student => student.studentId === formData.studentId)) {
         setErrors(prev => ({ ...prev, studentId: 'This Student ID already exists.' }));
         setSubmitError('Cannot add student: Duplicate Student ID.');
         return;
      }

      existingStudents.push(formData);
      localStorage.setItem('students', JSON.stringify(existingStudents));
      // No need to clear form data here, navigation will unmount it
      alert('Student data saved successfully!'); // Simple feedback
      navigate('/students'); // Navigate back to the list
    } catch (error) {
       console.error("Failed to save to localStorage:", error);
       setSubmitError('An error occurred while saving data. Please try again.');
    }
  };

  return (
    // Add noValidate to form to prevent default browser validation interfering
    <Container maxWidth="md" sx={{ marginTop: 10, paddingBottom: 4 }}> {/* Added padding bottom */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Student Registration Form
        </Typography>
        {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            {/* Update TextFields to show errors */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                error={!!errors.firstName} // Show error state
                helperText={errors.firstName} // Show error message
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Student ID"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
                error={!!errors.studentId}
                helperText={errors.studentId}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Major"
                name="major"
                value={formData.major}
                onChange={handleChange}
                required
                error={!!errors.major}
                helperText={errors.major}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date of Birth" // Added label for clarity
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}

export default StudentsForm;
