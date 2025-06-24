import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import { Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLoading } from './contexts/LoadingContext.jsx';
import { firestore as db } from './Firebase/config.js';
import { collection, getDocs, query, orderBy, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function Grades() {
  const { isLoadingGlobal, setIsLoadingGlobal } = useLoading();
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentsMap, setStudentsMap] = useState({});
  const [courses, setCourses] = useState([]);
  const [coursesMap, setCoursesMap] = useState({});
  const [notification, setNotification] = useState(null); // For errors or info messages
  const [highlightedGradeId, setHighlightedGradeId] = useState(null);
  const location = useLocation();
  const highlightedRowRef = useRef(null); // Ref for scrolling to highlighted row
  const [localLoading, setLocalLoading] = useState(false); // For form submissions/deletions

  // State for Add Grade Dialog
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // To differentiate between add and edit
  const [currentGrade, setCurrentGrade] = useState({ // Holds data for add/edit form
    id: null, // Will be set if editing an existing grade
    courseId: '',
    studentId: '',
    assignment: '',
    grade: '',
    date: new Date().toISOString().split('T')[0],
    feedback: ''
  });
  // State for Delete Confirmation Dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [gradeToDelete, setGradeToDelete] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoadingGlobal(true);
    setNotification(null);
    try {
      // Fetch all data in parallel for better performance
      const [studentsSnapshot, coursesSnapshot, gradesSnapshot] = await Promise.all([
        getDocs(collection(db, "students")),
        getDocs(collection(db, "courses")),
        getDocs(query(collection(db, "grades"), orderBy("date", "desc")))
      ]);

      let studentsData = studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      let coursesData = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      let gradesData = gradesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // If there are no grades in Firestore, use example data.
      if (gradesSnapshot.empty) {
        setNotification({
          message: "No grades found. Displaying example data. Add a new grade to see your own data.",
          severity: 'info'
        });

        studentsData = [
          { id: 'mock-student-1', firstName: 'John', lastName: 'Doe', studentId: 'S12345' },
          { id: 'mock-student-2', firstName: 'Jane', lastName: 'Smith', studentId: 'S67890' },
        ];
        coursesData = [
          { id: 'mock-course-1', name: 'Introduction to Programming' },
          { id: 'mock-course-2', name: 'Advanced Web Development' },
        ];
        gradesData = [
          { id: 'mock-grade-1', studentId: 'mock-student-1', courseId: 'mock-course-1', assignment: 'Homework 1', grade: 'A', date: '2023-10-26', feedback: 'Great work!' },
          { id: 'mock-grade-2', studentId: 'mock-student-2', courseId: 'mock-course-1', assignment: 'Homework 1', grade: 'B+', date: '2023-10-26', feedback: 'Good effort, check comments on question 3.' },
          { id: 'mock-grade-3', studentId: 'mock-student-1', courseId: 'mock-course-2', assignment: 'Project Proposal', grade: 'Pending', date: '2023-10-27', feedback: '' },
        ];
      }

      const studentIdMap = studentsData.reduce((acc, student) => {
        acc[student.id] = student;
        return acc;
      }, {});
      setStudents(studentsData);
      setStudentsMap(studentIdMap);
      const courseIdMap = coursesData.reduce((acc, course) => {
          acc[course.id] = course;
          return acc;
      }, {});
      setCourses(coursesData);
      setCoursesMap(courseIdMap);
      setGrades(gradesData);

    } catch (err) {
      console.error("Error fetching data from Firestore:", err);
      setNotification({ message: "Failed to load data. Please check your connection and Firestore rules.", severity: 'error' });
    } finally {
      setIsLoadingGlobal(false);
    }
  }, [setIsLoadingGlobal]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Check for a 'highlight' query parameter in the URL when the component loads
    const params = new URLSearchParams(location.search);
    const gradeIdToHighlight = params.get('highlight');
    if (gradeIdToHighlight) {
      setHighlightedGradeId(gradeIdToHighlight);
    }
  }, [location.search]);

  useEffect(() => {
    // Scroll to the highlighted row once it's rendered
    if (highlightedRowRef.current) {
      highlightedRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    // This effect should run when the grades are loaded or the highlight ID changes
  }, [highlightedGradeId, grades]);

  const handleOpenAddDialog = () => {
    setIsEditing(false);
    setCurrentGrade({
      courseId: '',
      studentId: '',
      assignment: '',
      grade: '',
      date: new Date().toISOString().split('T')[0],
      feedback: ''
    });
    setOpenFormDialog(true);
  };

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
  };

  const handleOpenEditDialog = (grade) => {
    setIsEditing(true);
    setCurrentGrade({ ...grade }); // Populate form with existing grade data
    setOpenFormDialog(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setCurrentGrade(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    if (!currentGrade.courseId || !currentGrade.studentId || !currentGrade.assignment || !currentGrade.grade || !currentGrade.date) {
      setNotification({ message: "Course, Student, Assignment, Grade, and Date are required.", severity: 'warning' });
      return;
    }
    setLocalLoading(true);
    setNotification(null);
    try {
      let gradeDocRef;
      if (isEditing && currentGrade.id) {
        // Update existing grade
        const gradeRef = doc(db, "grades", currentGrade.id);
        await updateDoc(gradeRef, {
          courseId: currentGrade.courseId,
          studentId: currentGrade.studentId,
          assignment: currentGrade.assignment,
          grade: currentGrade.grade,
          date: currentGrade.date,
          feedback: currentGrade.feedback
        });
        gradeDocRef = gradeRef; // Use existing ref for notification
      } else {
        // Add new grade
        gradeDocRef = await addDoc(collection(db, "grades"), currentGrade);
      }

      // --- Automatically create a notification ---
      const student = studentsMap[currentGrade.studentId];
      const course = coursesMap[currentGrade.courseId];
      const studentName = student ? `${student.firstName} ${student.lastName}` : 'the student';
      const courseName = course ? course.name : 'the course';

      let notificationMessage;
      if (isEditing) {
        notificationMessage = `Grade for ${studentName} in ${courseName} was updated to '${currentGrade.grade}'.`;
      } else {
        notificationMessage = `A new grade of '${currentGrade.grade}' was posted for ${studentName} in ${courseName}.`;
      }

      const notificationData = {
        sender: 'System',
        message: notificationMessage,
        type: 'grade_update',
        gradeId: gradeDocRef.id,
        studentId: currentGrade.studentId,
        timestamp: new Date().toISOString(),
        read: false,
      };
      await addDoc(collection(db, "notifications"), notificationData);
      // --- End of notification creation ---

      handleCloseFormDialog();
      fetchData(); // Refetch grades to show the new one
    } catch (err) {
      console.error("Error adding grade and notification:", err);
      setNotification({ message: "Failed to add the new grade. Please try again.", severity: 'error' });
    } finally { // Use localLoading for form submission
      setLocalLoading(false);
    }
  };

  const handleOpenDeleteDialog = (grade) => {
    setGradeToDelete(grade);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setGradeToDelete(null);
  };

  const handleDeleteGrade = async () => {
    if (!gradeToDelete) return;
    setLocalLoading(true); // Use localLoading for delete operation
    try {
      await deleteDoc(doc(db, "grades", gradeToDelete.id));
      handleCloseDeleteDialog();
      fetchData(); // Refetch grades after deletion
    } catch (err) {
      console.error("Error deleting grade:", err);
      setNotification({ message: "Failed to delete the grade. Please try again.", severity: 'error' });
    } finally {
      setLocalLoading(false);
    }
  };

  if (isLoadingGlobal) {
    return null; 
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Grades
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add New Grade
        </Button>
      </Box>

      {notification && <Alert severity={notification.severity} sx={{ mb: 2 }}>{notification.message}</Alert>}

      {grades.length === 0 && !isLoadingGlobal ? (
        <Paper elevation={2} sx={{ padding: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            No grades have been posted yet. Use the "Add New Grade" button to create one.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 700 }} aria-label="grades table">
            <TableHead sx={{ backgroundColor: 'primary.dark' }}>
              <TableRow>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Student</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Course</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Assignment</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }} align="center">Grade</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }} align="right">Date Posted</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Feedback</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grades.map((grade) => {
                const isHighlighted = grade.id === highlightedGradeId;
                const isMock = grade.id.startsWith('mock-');
                const student = studentsMap[grade.studentId];
                // Handle cases where old data might have `grade.course` as a string
                const courseName = coursesMap[grade.courseId]?.name || grade.course || 'Unknown Course';
                const studentName = student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';

                return (
                  <StyledTableRow
                    key={grade.id}
                    ref={isHighlighted ? highlightedRowRef : null}
                    sx={{
                      transition: 'background-color 0.8s ease-in-out',
                      ...(isHighlighted && {
                        backgroundColor: (theme) => theme.palette.action.focus,
                      }),
                    }}
                  >
                    <TableCell>{studentName}</TableCell>
                    <TableCell component="th" scope="row">
                      {courseName}
                    </TableCell>
                    <TableCell>{grade.assignment}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: grade.grade === 'Pending' ? 'normal' : 'medium', color: grade.grade === 'Pending' ? 'text.secondary' : 'text.primary' }}>
                      {grade.grade}
                    </TableCell>
                    <TableCell align="right">{grade.date}</TableCell>
                    <TableCell sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                      {grade.feedback || '-'}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleOpenEditDialog(grade)} disabled={isMock}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleOpenDeleteDialog(grade)} disabled={isMock}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Grade Dialog */}
      <Dialog open={openFormDialog} onClose={handleCloseFormDialog}>
        <DialogTitle>{isEditing ? 'Edit Grade' : 'Add New Grade'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" required>
            <InputLabel id="course-select-label">Course</InputLabel>
            <Select
              labelId="course-select-label"
              name="courseId"
              value={currentGrade.courseId}
              label="Course"
              onChange={handleFormChange}
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense" required>
            <InputLabel id="student-select-label">Student</InputLabel>
            <Select
              labelId="student-select-label"
              name="studentId"
              value={currentGrade.studentId}
              label="Student"
              onChange={handleFormChange}
            >
              {students.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.firstName} {student.lastName} ({student.studentId})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            name="assignment"
            label="Assignment Name"
            type="text"
            fullWidth
            variant="outlined"
            value={currentGrade.assignment}
            onChange={handleFormChange}
            required
          />
          <TextField
            margin="dense"
            name="grade"
            label="Grade (e.g., A, B+, Pending)"
            type="text"
            fullWidth
            variant="outlined"
            value={currentGrade.grade}
            onChange={handleFormChange}
            required
          />
          <TextField
            margin="dense"
            name="date"
            label="Date Posted"
            type="date"
            fullWidth
            variant="outlined"
            value={currentGrade.date}
            onChange={handleFormChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            margin="dense"
            name="feedback"
            label="Feedback (Optional)"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={currentGrade.feedback}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFormDialog} disabled={localLoading}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained" disabled={localLoading}>
            {localLoading ? <CircularProgress size={24} /> : (isEditing ? 'Save Changes' : 'Add Grade')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the grade for "{gradeToDelete?.assignment}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={localLoading}>Cancel</Button>
          <Button onClick={handleDeleteGrade} color="error" autoFocus disabled={localLoading}>
            {localLoading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
