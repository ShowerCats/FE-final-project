import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Paper, List, ListItem, ListItemText,
  CircularProgress, Box, Button, Divider, Alert,
  Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, InputLabel, Select, MenuItem, IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { firestore as db } from './Firebase/config.js';
import {
  doc, getDoc, collection, query, where, getDocs, addDoc, documentId
} from "firebase/firestore";

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [professor, setProfessor] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]); // For the "add student" dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openAddStudentDialog, setOpenAddStudentDialog] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCourseData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Course Details
      const courseRef = doc(db, "courses", courseId);
      const courseSnap = await getDoc(courseRef);

      if (!courseSnap.exists()) {
        setError("Course not found.");
        setLoading(false);
        return;
      }
      const courseData = { id: courseSnap.id, ...courseSnap.data() };
      setCourse(courseData);

      // 2. Fetch Professor Details
      if (courseData.professorId) {
        const profRef = doc(db, "professors", courseData.professorId);
        const profSnap = await getDoc(profRef);
        if (profSnap.exists()) {
          setProfessor(profSnap.data());
        }
      }

      // 3. Fetch Enrollments and Enrolled Student Details
      const enrollmentsQuery = query(collection(db, "enrollments"), where("courseId", "==", courseId));
      const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
      const studentIds = enrollmentsSnapshot.docs.map(d => d.data().studentId);

      if (studentIds.length > 0) {
        // Firestore 'in' query is limited to 30 items. For more, batching or alternative strategies are needed.
        const studentsQuery = query(collection(db, "students"), where(documentId(), "in", studentIds));
        const studentsSnapshot = await getDocs(studentsQuery);
        setEnrolledStudents(studentsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        setEnrolledStudents([]);
      }

      // 4. Fetch all students for the "add student" dropdown
      const allStudentsSnapshot = await getDocs(collection(db, "students"));
      setAllStudents(allStudentsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

    } catch (err) {
      console.error("Error fetching course details:", err);
      setError("Failed to load course data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  const handleOpenAddStudentDialog = () => {
    setSelectedStudentId('');
    setOpenAddStudentDialog(true);
  };

  const handleCloseAddStudentDialog = () => {
    setOpenAddStudentDialog(false);
  };

  const handleAddStudentToCourse = async () => {
    if (!selectedStudentId) {
      setError("Please select a student to add.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      // Check if student is already enrolled (client-side check, robust backend check is better)
      if (enrolledStudents.some(s => s.id === selectedStudentId)) {
          setError("This student is already enrolled in this course.");
          setIsSubmitting(false);
          return;
      }

      await addDoc(collection(db, "enrollments"), {
        courseId: courseId,
        studentId: selectedStudentId,
        enrollmentDate: new Date().toISOString().split('T')[0] // Example enrollment date
      });
      setOpenAddStudentDialog(false);
      fetchCourseData(); // Refresh data
    } catch (err) {
      console.error("Error adding student to course:", err);
      setError("Failed to add student. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 5 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading course details...</Typography>
      </Container>
    );
  }

  if (error && !course) { // Show fatal error if course couldn't be loaded at all
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h5" color="error" gutterBottom>{error}</Typography>
        <Button variant="outlined" onClick={() => navigate('/courses')}>Go Back to Courses</Button>
      </Container>
    );
  }

  const availableStudentsToAdd = allStudents.filter(
    student => !enrolledStudents.some(enrolled => enrolled.id === student.id)
  );

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/courses')}
        sx={{ mb: 2 }}
      >
        Back to All Courses
      </Button>

      {course && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {course.name}
          </Typography>
          {professor && (
            <Typography variant="h6" color="text.secondary">
              Professor: {professor.firstName} {professor.lastName}
            </Typography>
          )}
          <Typography variant="body1" sx={{ mt: 1 }}>
            Credits: {course.credits}
          </Typography>
          {course.description && (
            <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
              Description: {course.description}
            </Typography>
          )}
        </Paper>
      )}

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Enrolled Students ({enrolledStudents.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleOpenAddStudentDialog}
            disabled={!course} // Disable if course data hasn't loaded
          >
            Add Student to Course
          </Button>
        </Box>
        {enrolledStudents.length === 0 ? (
          <Typography>No students are currently enrolled in this course.</Typography>
        ) : (
          <List>
            {enrolledStudents.map((student, index) => (
              <React.Fragment key={student.id}>
                <ListItem>
                  <ListItemText
                    primary={`${student.firstName} ${student.lastName}`}
                    secondary={`ID: ${student.studentId} | Email: ${student.email} | Major: ${student.major || 'N/A'}`}
                  />
                </ListItem>
                {index < enrolledStudents.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Add Student Dialog */}
      <Dialog open={openAddStudentDialog} onClose={handleCloseAddStudentDialog} fullWidth maxWidth="xs">
        <DialogTitle>Add Student to {course?.name}</DialogTitle>
        <DialogContent>
          {availableStudentsToAdd.length === 0 ? (
            <Typography>All students are already enrolled or no students available.</Typography>
          ) : (
            <FormControl fullWidth margin="dense" required>
              <InputLabel id="student-select-label">Select Student</InputLabel>
              <Select
                labelId="student-select-label"
                value={selectedStudentId}
                label="Select Student"
                onChange={(e) => setSelectedStudentId(e.target.value)}
              >
                {availableStudentsToAdd.map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {`${student.firstName} ${student.lastName} (${student.studentId}) - Major: ${student.major || 'N/A'}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddStudentDialog}>Cancel</Button>
          <Button
            onClick={handleAddStudentToCourse}
            variant="contained"
            disabled={isSubmitting || !selectedStudentId || availableStudentsToAdd.length === 0}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Add Student"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}