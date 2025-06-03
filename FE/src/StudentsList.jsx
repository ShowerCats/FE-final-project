import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress'; // For loading state

// Dialog components for delete confirmation
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { firestore as db } from './Firebase/config.js';
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  writeBatch,
  query,
  where
} from "firebase/firestore";

function StudentsList() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Delete Confirmation Dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const studentsCollectionRef = collection(db, "students");
      const querySnapshot = await getDocs(studentsCollectionRef);
      const studentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(studentsData);
    } catch (err) {
      console.error("Error fetching students from Firestore:", err);
      setError("Failed to load students. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = () => {
    navigate('/students/add');
  };

  const handleEditStudent = (studentId) => {
    navigate(`/students/edit/${studentId}`);
  };

  const handleOpenDeleteDialog = (student) => {
    setStudentToDelete(student);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setStudentToDelete(null);
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    // Use a more specific loading state for the delete operation if needed,
    // or reuse the general 'loading' state if acceptable.
    // For simplicity, we'll reuse 'loading' but ideally, you might have 'isDeleting'.
    setLoading(true);
    setError(null);
    try {
      const batch = writeBatch(db);

      // 1. Delete the student document
      const studentRef = doc(db, "students", studentToDelete.id);
      batch.delete(studentRef);

      // 2. Find and delete all enrollments for this student
      // Assuming studentId in enrollments collection matches the student's document ID
      const enrollmentsQuery = query(collection(db, "enrollments"), where("studentId", "==", studentToDelete.id));
      const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
      enrollmentsSnapshot.docs.forEach(enrollmentDoc => {
        batch.delete(doc(db, "enrollments", enrollmentDoc.id));
      });

      await batch.commit();
      setOpenDeleteDialog(false);
      setStudentToDelete(null);
      fetchStudents(); // Refresh the list
    } catch (err) {
      console.error("Error deleting student and their enrollments:", err);
      setError("Failed to delete student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && students.length === 0) { // Show full page loader only on initial load
    return (
      <Container maxWidth="lg" sx={{ marginTop: 10, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading students...</Typography>
      </Container>
    );
  }

  if (error && students.length === 0) { // Show full page error only if no data could be loaded
    return (
      <Container maxWidth="lg" sx={{ marginTop: 10, textAlign: 'center', color: 'red' }}>
        <Typography>{error}</Typography>
        <Button onClick={fetchStudents} variant="outlined" sx={{ mt: 2 }}>Try Again</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: 10 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Students List
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddStudent}>
          Add New Student
        </Button>
      </Box>

      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

      {students.length === 0 && !loading ? (
        <Typography sx={{ textAlign: 'center', mt: 4 }}>
          No students registered yet. Click "Add New Student" to begin.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="student table">
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Student ID</TableCell>
                <TableCell>Major</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Address</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow
                  key={student.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{student.firstName}</TableCell>
                  <TableCell>{student.lastName}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{student.major}</TableCell>
                  <TableCell>{student.dateOfBirth}</TableCell>
                  <TableCell>{student.phoneNumber}</TableCell>
                  <TableCell>{student.address}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label="edit"
                      color="primary"
                      size="small"
                      onClick={() => handleEditStudent(student.id)}
                      sx={{ mr: 0.5 }} // Add some margin if icons are too close
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      color="error"
                      size="small"
                      onClick={() => handleOpenDeleteDialog(student)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the student "{studentToDelete?.firstName} {studentToDelete?.lastName}" (ID: {studentToDelete?.studentId})? This action will also remove all their course enrollments and cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteStudent} color="error" autoFocus disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default StudentsList;
