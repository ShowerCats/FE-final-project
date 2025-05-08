import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import { firestore as db} from './Firebase/config.js'; // Assuming your firebase config is in 'src/firebase.js'
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

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
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    // Clear error for the field being changed
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Basic required field validation (expand as needed)
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required.';
      isValid = false;
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid.';
      isValid = false;
    }
    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required.';
      isValid = false;
    }
    if (!formData.major.trim()) {
      newErrors.major = 'Major is required.';
      isValid = false;
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required.';
      isValid = false;
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required.';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) { // Simple 10 digit check
        newErrors.phoneNumber = 'Phone number must be 10 digits.';
        isValid = false;
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      setSubmitError('Please fix the errors in the form.');
      return;
    }

    try {
      const studentsCollectionRef = collection(db, "students");
      const q = query(studentsCollectionRef, where("studentId", "==", formData.studentId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
         setErrors(prev => ({ ...prev, studentId: 'This Student ID already exists in the database.' }));
         setSubmitError('Cannot add student: Duplicate Student ID found in the database.');
         return;
      }

      await addDoc(studentsCollectionRef, formData);
      alert('Student data saved successfully to Firestore!');
      navigate('/students');
    } catch (error) {
       console.error("Error adding document to Firestore: ", error);
       setSubmitError('An error occurred while saving data to Firestore. Please try again.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 10, paddingBottom: 4 }}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Student Registration Form
        </Typography>
        {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                error={!!errors.firstName}
                helperText={errors.firstName}
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
                label="Date of Birth"
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