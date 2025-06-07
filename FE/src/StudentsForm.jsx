// c:\Users\Ori\Downloads\FE Project\FE-final-project\FE\src\StudentsForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress
import { firestore as db} from './Firebase/config.js';
import { useLoading } from './contexts/LoadingContext'; // Import useLoading
import { collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";

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
  const { studentId: routeStudentId } = useParams();
  const isEditMode = !!routeStudentId;
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(''); // For form submission errors
  const { isLoadingGlobal, setIsLoadingGlobal } = useLoading(); // Use global loading
  const [localLoading, setLocalLoading] = useState(false); // For submit button, distinct from global page load

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      if (isEditMode && routeStudentId) {
        setIsLoadingGlobal(true);
        setSubmitError(''); // Clear previous errors
        try {
          const studentDocRef = doc(db, "students", routeStudentId);
          const studentDocSnap = await getDoc(studentDocRef);

          if (studentDocSnap.exists()) {
            setFormData(studentDocSnap.data());
          } else {
            console.error("No such document!");
            setSubmitError("Student not found.");
          }
        } catch (error) {
          console.error("Error fetching student document: ", error);
          setSubmitError("Failed to load student data for editing.");
        } finally {
          setIsLoadingGlobal(false);
        }
      }
    };
    fetchStudentData();
  }, [routeStudentId, isEditMode, setIsLoadingGlobal]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
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
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
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

  const addStudent = async (data) => {
    const studentsCollectionRef = collection(db, "students");
    const q = query(studentsCollectionRef, where("studentId", "==", data.studentId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
       setErrors(prev => ({ ...prev, studentId: 'This Student ID already exists in the database.' }));
       setSubmitError('Cannot add student: Duplicate Student ID found in the database.');
       throw new Error('Duplicate Student ID');
    }
    await addDoc(studentsCollectionRef, data);
    alert('Student data saved successfully to Firestore!');
  };

  const updateStudent = async (id, data) => {
     const studentDocRef = doc(db, "students", id);
     await updateDoc(studentDocRef, data);
     alert('Student data updated successfully in Firestore!');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    if (!validateForm()) {
      setSubmitError('Please fix the errors in the form before submitting.');
      return;
    }
    setLocalLoading(true); // For submit button state
    try {
      if (isEditMode) {
        await updateStudent(routeStudentId, formData);
      } else {
        await addStudent(formData);
      }
      navigate('/students');
    } catch (error) {
       console.error("Error processing student data: ", error);
       if (error.message !== 'Duplicate Student ID') {
         setSubmitError('An error occurred while saving data. Please try again.');
       }
    } finally {
      setLocalLoading(false); // Reset submit button state
    }
  };

  // If global loading is active (e.g., fetching student data for edit mode), show global loader
  if (isLoadingGlobal && isEditMode) return null;

  return (
    <Container maxWidth="md" sx={{ marginTop: 10, paddingBottom: 4 }}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? 'Edit Student' : 'Student Registration Form'}
        </Typography>

        {/* Display submit error if not globally loading */}
        {submitError && !isLoadingGlobal && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}
        
        {/* Render form if not in edit mode OR if in edit mode and not globally loading */}
        {(!isEditMode || (isEditMode && !isLoadingGlobal)) && (
          <form onSubmit={handleSubmit} noValidate>
            <fieldset disabled={localLoading}> {/* Disable form fields during local submission loading */}
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
                    disabled={isEditMode}
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
                  <Button type="submit" variant="contained" color="primary" disabled={localLoading}>
                    {localLoading ? <CircularProgress size={24} /> : (isEditMode ? 'Update Student' : 'Register')}
                  </Button>
                </Grid>
              </Grid>
            </fieldset>
          </form>
        )}
      </Box>
    </Container>
  );
}
export default StudentsForm;