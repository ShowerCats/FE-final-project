import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
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
import Container from '@mui/material/Container'; // Added Container for better layout
import { firestore as db } from './Firebase/config.js'; // Import Firestore instance
import { collection, getDocs } from "firebase/firestore"; // Import Firestore functions

function StudentsList() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate(); // For the "Add New Student" button
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchStudents();
  }, []);

  const handleAddStudent = () => {
    navigate('/students/add'); // Navigate to the form
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ marginTop: 10, textAlign: 'center' }}>
        <Typography>Loading students...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ marginTop: 10, textAlign: 'center', color: 'red' }}>
        <Typography>{error}</Typography>
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

      {students.length === 0 ? (
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
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow
                  key={student.id} // Use Firestore document ID as key
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default StudentsList;