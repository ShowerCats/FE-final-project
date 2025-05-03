import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button'; // Optional: For actions like "View Details"

const mockCourses = [
  { id: 'CS101', name: 'Introduction to Programming', instructor: 'Prof. Smith', credits: 3, description: 'Fundamentals of programming using Python.' },
  { id: 'MA101', name: 'Calculus I', instructor: 'Prof. Johnson', credits: 4, description: 'Limits, derivatives, and introduction to integration.' },
  { id: 'PH201', name: 'University Physics I', instructor: 'Dr. Lee', credits: 4, description: 'Mechanics, heat, and thermodynamics.' },
  { id: 'EN102', name: 'College Composition II', instructor: 'Ms. Davis', credits: 3, description: 'Advanced essay writing and research methods.' },
  { id: 'HI105', name: 'World History Since 1500', instructor: 'Prof. Khan', credits: 3, description: 'Survey of major global events and developments.' },
];

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function Courses() {
  const courses = mockCourses; // In a real app, fetch this data

  const handleViewDetails = (courseId) => {
    // Placeholder for future functionality (e.g., navigate to a course detail page)
    alert(`View details for course ${courseId} (not implemented)`);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1100, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Available Courses
      </Typography>

      {courses.length === 0 ? (
        <Paper elevation={2} sx={{ padding: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            No courses available at this time.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 750 }} aria-label="courses table">
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Code</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Course Name</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Instructor</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }} align="center">Credits</TableCell>
                <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Description</TableCell>
                {/* Optional Action Column */}
                {/* <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }} align="center">Actions</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <StyledTableRow key={course.id}>
                  <TableCell component="th" scope="row">
                    {course.id}
                  </TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell align="center">{course.credits}</TableCell>
                  <TableCell sx={{ maxWidth: 300, whiteSpace: 'normal' }}>{course.description}</TableCell>
                  {/* Optional Action Cell */}
                  {/*
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewDetails(course.id)}
                    >
                      Details
                    </Button>
                  </TableCell>
                  */}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
