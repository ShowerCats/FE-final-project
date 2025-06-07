import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
// Firebase imports
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch
} from "firebase/firestore";
import { firestore as db } from './Firebase/config.js'; // Adjust path if necessary

// Material UI components for Form/Dialog
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import { useLoading } from './contexts/LoadingContext'; // Import useLoading

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const { isLoadingGlobal, setIsLoadingGlobal } = useLoading(); // Use global loading
  const [error, setError] = useState(null); // For page-specific errors
  const [localLoading, setLocalLoading] = useState(false); // For form submissions/deletions

  // State for Add/Edit Course Modal
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({
    id: null,
    name: '',
    description: '',
    credits: '',
    professorId: ''
  });

  // State for Delete Confirmation Dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchAllData = async () => {
    setIsLoadingGlobal(true);
    setError(null);
    try {
      // 1. Fetch all professors
      const professorsSnapshot = await getDocs(collection(db, "professors"));
      const professorsData = professorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProfessors(professorsData);
      const professorsMap = professorsData.reduce((acc, prof) => {
        acc[prof.id] = `${prof.firstName} ${prof.lastName}`;
        return acc;
      }, {});

      // 2. Fetch all enrollments to count students per course
      const enrollmentsSnapshot = await getDocs(collection(db, "enrollments"));
      const studentCounts = enrollmentsSnapshot.docs.reduce((acc, doc) => {
        const { courseId } = doc.data();
        acc[courseId] = (acc[courseId] || 0) + 1;
        return acc;
      }, {});

      // 3. Fetch all courses
      const coursesSnapshot = await getDocs(collection(db, "courses"));
      const coursesData = coursesSnapshot.docs.map(doc => {
        const course = { id: doc.id, ...doc.data() };
        return {
          ...course,
          professorName: professorsMap[course.professorId] || 'N/A',
          studentCount: studentCounts[course.id] || 0
        };
      });
      setCourses(coursesData);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setIsLoadingGlobal(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [setIsLoadingGlobal]); // Add setIsLoadingGlobal to dependency array

  // CRUD Handlers
  const handleOpenAddDialog = () => {
    setIsEditing(false);
    setCurrentCourse({ id: null, name: '', description: '', credits: '', professorId: '' });
    setOpenFormDialog(true);
  };

  const handleOpenEditDialog = (course) => {
    setIsEditing(true);
    setCurrentCourse({ ...course });
    setOpenFormDialog(true);
  };

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setCurrentCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    if (!currentCourse.name || !currentCourse.professorId || !currentCourse.credits) {
      setError("Course Name, Professor, and Credits are required.");
      return;
    }
    setLocalLoading(true); // Use local loading for form submission
    try {
      const courseData = {
        name: currentCourse.name,
        description: currentCourse.description,
        credits: parseInt(currentCourse.credits, 10),
        professorId: currentCourse.professorId
      };

      if (isEditing && currentCourse.id) {
        const courseRef = doc(db, "courses", currentCourse.id);
        await updateDoc(courseRef, courseData);
      } else {
        await addDoc(collection(db, "courses"), courseData);
      }
      setOpenFormDialog(false);
      setError(null); // Clear previous errors
      fetchAllData();
    } catch (err) {
      console.error("Error saving course:", err);
      setError(`Failed to ${isEditing ? 'update' : 'add'} course. Please try again.`);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleOpenDeleteDialog = (course) => {
    setCourseToDelete(course);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCourseToDelete(null);
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    setLocalLoading(true); // Use local loading for delete operation
    try {
      const batch = writeBatch(db);
      const courseRef = doc(db, "courses", courseToDelete.id);
      batch.delete(courseRef);

      const enrollmentsQuery = query(collection(db, "enrollments"), where("courseId", "==", courseToDelete.id));
      const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
      enrollmentsSnapshot.docs.forEach(enrollmentDoc => {
        batch.delete(doc(db, "enrollments", enrollmentDoc.id));
      });

      await batch.commit();
      setOpenDeleteDialog(false);
      setCourseToDelete(null);
      setError(null); // Clear previous errors
      fetchAllData();
    } catch (err) {
      console.error("Error deleting course:", err);
      setError("Failed to delete course. Please try again.");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  // If global loading is active, LoadingScreen will be shown by App.jsx
  if (isLoadingGlobal) return null;

  // Show error message if there's an error and not globally loading, and no courses are loaded
  if (error && !isLoadingGlobal && courses.length === 0) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h6" color="error" gutterBottom>{error}</Typography>
        <Button onClick={fetchAllData} variant="outlined" sx={{ mt: 2 }}>Try Again</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            All Courses
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
          >
            Add New Course
          </Button>
        </Box>

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        {courses.length === 0 && !isLoadingGlobal && !localLoading ? (
          <Typography>No courses found. Add a new one to get started!</Typography>
        ) : (
          <Paper elevation={3}>
            <List>
              {courses.map((course, index) => (
                <React.Fragment key={course.id}>
                  <ListItem
                    button // Makes the ListItem interactive
                    onClick={() => handleCourseClick(course.id)} // Navigate on click
                    secondaryAction={
                      <>
                        <IconButton edge="end" aria-label="edit" onClick={(e) => { e.stopPropagation(); handleOpenEditDialog(course); }} sx={{ mr: 1 }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={(e) => { e.stopPropagation(); handleOpenDeleteDialog(course); }}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    }
                  >
                    <ListItemText
                      primary={`Course Name: ${course.name}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            Professor: {course.professorName}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" color="text.primary">
                            Students number: {course.studentCount}
                          </Typography>
                          {course.description && (
                            <>
                              <br />
                              <Typography component="span" variant="body2" color="text.secondary">
                                Description: {course.description}
                              </Typography>
                            </>
                          )}
                           {course.credits && (
                            <>
                              <br />
                              <Typography component="span" variant="body2" color="text.secondary">
                                Credits: {course.credits}
                              </Typography>
                            </>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  {index < courses.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      {/* Add/Edit Course Dialog */}
      <Dialog open={openFormDialog} onClose={handleCloseFormDialog}>
        <DialogTitle>{isEditing ? 'Edit Course' : 'Add New Course'}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{mb: 2}}>
            Please fill in the details for the course.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Course Name"
            type="text"
            fullWidth
            variant="outlined"
            value={currentCourse.name}
            onChange={handleFormChange}
            required
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={currentCourse.description}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="credits"
            label="Credits"
            type="number"
            fullWidth
            variant="outlined"
            value={currentCourse.credits}
            onChange={handleFormChange}
            required
          />
          <FormControl fullWidth margin="dense" required>
            <InputLabel id="professor-select-label">Professor</InputLabel>
            <Select
              labelId="professor-select-label"
              name="professorId"
              value={currentCourse.professorId}
              label="Professor"
              onChange={handleFormChange}
            >
              {professors.map((prof) => (
                <MenuItem key={prof.id} value={prof.id}>
                  {`${prof.firstName} ${prof.lastName}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFormDialog}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained" disabled={localLoading}>
            {localLoading ? <CircularProgress size={24} /> : (isEditing ? 'Save Changes' : 'Add Course')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the course "{courseToDelete?.name}"? This action will also remove all student enrollments for this course and cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteCourse} color="error" autoFocus disabled={localLoading}>
            {localLoading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
